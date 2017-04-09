import { computed, action, observable } from 'mobx';
import { omit } from 'lodash';

import Activity from './activity';
import { store } from './index';
import getOffsets from '../utils/getOffsets';
import type { BoundsT } from './store';

// find activities immediately to the left and to the right of the current activity
// to draw boundary markers and control movement by dragging and resizing
export const calculateBounds = (
  activity: Activity,
  activities: Array<Activity>
): BoundsT => {
  const endBefore = activities.filter(ac => ac.endTime <= activity.startTime);
  const startAfter = activities.filter(ac => ac.startTime >= activity.endTime);
  const leftBoundActivity = endBefore.length &&
    endBefore.reduce((pre, cur) => pre.endTime < cur.endTime ? cur : pre);
  const rightBoundActivity = startAfter.length &&
    startAfter.reduce((pre, cur) => pre.startTime > cur.startTime ? cur : pre);

  const leftBoundTime = leftBoundActivity ? leftBoundActivity.endTime : 0;
  const rightBoundTime = rightBoundActivity
    ? rightBoundActivity.startTime
    : store.graphDuration;

  return {
    leftBoundActivity,
    leftBoundTime,
    rightBoundActivity,
    rightBoundTime
  };
};

export default class ActivityStore {
  constructor() {
    this.all = [];
  }

  @observable all: Array<Activity> = [];

  @computed get activityOffsets(): any {
    return [1, 2, 3].reduce(
      (acc, plane) => ({ ...acc, ...getOffsets(plane, this.all) }),
      {}
    );
  }

  @action addActivity = (plane: number, rawX: number): void => {
    const [x, _] = store.ui.rawMouseToTime(rawX, 0);
    let length;
    if (!store.overlapAllowed) {
      const { rightBoundTime } = calculateBounds(
        { startTime: x, length: 0, id: 0 },
        this.all
      );
      const maxLength = rightBoundTime - x;
      length = Math.min(maxLength, 5);
    } else {
      length = 5;
    }
    if (length >= 1) {
      const newActivity = new Activity(plane, x, 'Unnamed', length);
      this.all.push(newActivity);
      store.state = { mode: 'rename', currentActivity: newActivity, val: '' };
      store.addHistory();
    }
  };

  @action swapActivities = (left: Activity, right: Activity) => {
    right.startTime = left.startTime;
    left.startTime = right.startTime + right.length;
    store.addHistory();
  };

  @action startResizing = (activity: Activity) => {
    if (store.state.mode === 'rename') {
      store.state.currentActivity.rename(store.state.val);
    }
    const bounds = calculateBounds(activity, this.all);
    store.state = { mode: 'resizing', currentActivity: activity, bounds };
  };

  @action stopMoving = () => {
    if (store.state.mode === 'moving' && store.state.currentActivity.wasMoved) {
      store.state = { mode: 'normal' };
      store.ui.cancelScroll();
      store.addHistory();
    }
  };

  @action stopResizing = () => {
    store.state = { mode: 'normal' };
    store.ui.cancelScroll();
    store.addHistory();
  };

  @action mongoAdd = (x: any) => {
    if (!store.findId({ type: 'activity', id: x._id })) {
      this.all.push(
        new Activity(x.plane, x.startTime, x.title, x.length, x._id)
      );
    }
  };

  @action mongoChange = (newact: any, oldact: any) => {
    store.findId({ type: 'activity', id: oldact._id }).update(newact);
  };

  @action mongoRemove = (remact: any) => {
    this.all = this.all.filter(x => x.id !== remact._id);
  };

  @computed get mongoObservers(): Object {
    return {
      added: this.mongoAdd,
      changed: this.mongoChange,
      removed: this.mongoRemove
    };
  }

  @computed get history(): Array<any> {
    return this.all.map(x => ({ ...omit(x, 'over') }));
  }
}
