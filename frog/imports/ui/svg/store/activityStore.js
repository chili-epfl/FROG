// @flow
import { computed, action, observable } from 'mobx';

import Activity from './activity';
import { store } from './store';
import getOffsets from '../utils/getOffsets';

// find activities immediately to the left and to the right of the current activity
// to draw boundary markers and control movement by dragging and resizing
const calculateBounds = (
  activity: Activity,
  activities: Array<Activity>
): [Activity, Activity] => {
  const sorted = activities
    .filter(x => x.id !== activity.id)
    .sort((a, b) => a.startTime - b.startTime);
  const leftbound = sorted
    .filter(act => act.startTime <= activity.startTime)
    .pop();
  const rightbound = sorted
    .filter(act => act.startTime >= activity.startTime + activity.length)
    .shift();
  return [leftbound, rightbound];
};

export default class ActivityStore {
  @observable all: Array<Activity> = [];

  @computed get activityOffsets(): any {
    return [1, 2, 3].reduce(
      (acc, plane) => ({ ...acc, ...getOffsets(plane, this.all) }),
      {}
    );
  }

  @action rename(newTitle: string) {
    if (this.renameOpen) {
      this.renameOpen.title = newTitle;
      this.renameOpen = null;
      this.addHistory();
    }
  }

  @action addActivity = (plane: number, rawX: number): void => {
    const [x, _] = this.rawMouseToTime(rawX, 0);
    const newActivity = new Activity(plane, x, 'Unnamed', 5);
    this.activities.push(newActivity);
    this.renameOpen = newActivity;
    this.addHistory();
  };

  @action swapActivities = (left: Activity, right: Activity) => {
    right.startTime = left.startTime;
    left.startTime = right.startTime + right.length;
    this.addHistory();
  };

  @action startResizing = (activity: Activity) => {
    const rightBound = calculateBounds(activity, this.all)[1];
    store.mode = { mode: 'resizing', currentActivity: activity, rightBound };
  };

  @action startMoving = (activity: Activity) => {
    const [leftBound, rightBound] = calculateBounds(activity, this.all);
    this.mode = {
      mode: 'moving',
      currentActivity: activity,
      leftBound,
      rightBound
    };
    activity.overdrag = 0;
  };

  @action stopMoving = () => {
    store.mode = { mode: 'normal' };
    store.addHistory();
    store.cancelScroll();
  };

  @action stopResizing = () => {
    store.mode = { mode: 'normal' };
    store.addHistory();
    store.cancelScroll();
  };

  @action mongoAdd = (x: any) => {
    if (!store.findId({ type: 'activity', id: x._id })) {
      this.all.push(new Activity(
        x.plane,
        x.startTime,
        x.title,
        x.length,
        x._id
      ));
    }
  };

  @action mongoChange = (newact: any, oldact: any) => {
    store.findId({ type: 'activity', id: oldact._id }).update(newact);
  };

  @action mongoRemove = (remact: any) => {
    store.activities = this.activities.filter(x => x.id !== remact._id);
  };

  @computed get mongoObservers(): Object {
    return {
      added: this.mongoAdd,
      changed: this.mongoChange,
      removed: this.mongoRemove
    };
  }

  @computed get history(): Array<any> {
    return this.all.map(x => ({ ...x }));
  }
}
