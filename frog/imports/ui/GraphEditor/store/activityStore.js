// @flow
import { computed, action, observable } from 'mobx';
import { omit, maxBy } from 'lodash';

import Activity from './activity';
import { duplicateActivity } from '../../../api/activities';
import { store } from './index';
import getOffsets from '../utils/getOffsets';
import { between } from '../utils';
import type { BoundsT } from './store';

// find activities immediately to the left and to the right of the current activity
// to draw boundary markers and control movement by dragging and resizing
export const calculateBounds = (
  act: { startTime: number, length: number },
  activities: Array<Activity>
): BoundsT => {
  const activity = { ...act, endTime: act.startTime + act.length };
  const endBefore = activities.filter(ac => ac.endTime <= activity.startTime);
  const startAfter = activities.filter(ac => ac.startTime >= activity.endTime);
  const leftBoundActivity = endBefore.length
    ? endBefore.reduce((pre, cur) => (pre.endTime < cur.endTime ? cur : pre))
    : undefined;
  const rightBoundActivity = startAfter.length
    ? startAfter.reduce(
        (pre, cur) => (pre.startTime > cur.startTime ? cur : pre)
      )
    : undefined;

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

  @observable all: any = [];

  @observable activitySequence: any;

  @action
  setActivitySequence(act: any) {
    this.activitySequence = act;
  }

  @computed
  get activityOffsets(): any {
    return [1, 2, 3].reduce(
      (acc, plane) => ({ ...acc, ...getOffsets(plane, this.all) }),
      {}
    );
  }

  @action
  duplicateActivity = () => {
    if (store.ui.selected instanceof Activity) {
      const x = duplicateActivity(store.ui.selected.id);
      this.mongoAdd(x);
    }
  };

  @action
  addActivity = (plane: number, rawX: number): void => {
    if (store.state.mode === 'readOnly') {
      return;
    }
    const [rawTime, _] = store.ui.rawMouseToTime(rawX, 0);
    const time = Math.round(rawTime);
    let length;
    if (!store.overlapAllowed) {
      const { rightBoundTime } = calculateBounds(
        { startTime: time, length: 0, id: '0' },
        this.all
      );
      const maxLength = rightBoundTime - time;
      length = Math.min(maxLength, 5);
    } else {
      length = 5;
    }
    if (length >= 1) {
      const newActivity = new Activity(plane, time, 'Unnamed', length);

      this.all.push(newActivity);
      store.state = { mode: 'rename', currentActivity: newActivity, val: '' };
      store.addHistory();
    }
  };

  @action
  newActivityAbove = (plane?: number) => {
    if (store.ui.selected instanceof Activity) {
      const toCopy = store.ui.selected;
      store.activityStore.all.push(
        new Activity(
          plane || toCopy.plane,
          toCopy.startTime,
          'Unnamed',
          toCopy.length
        )
      );
      store.addHistory();
    }
  };

  @action
  swapActivities = (left: Activity, right: Activity) => {
    right.startTime = left.startTime;
    left.startTime = right.startTime + right.length;
    store.addHistory();
  };

  @action
  startResizing = (activity: Activity) => {
    if (store.state.mode === 'rename') {
      store.state.currentActivity.rename(store.state.val);
    }
    const bounds = calculateBounds(activity, this.all);
    store.state = { mode: 'resizing', currentActivity: activity, bounds };
  };

  @action
  movePlane = (increment: number) => {
    if (store.ui.selected instanceof Activity) {
      const oldplane = store.ui.selected.plane;
      store.ui.selected.plane = between(1, 3, oldplane + increment);
      if (oldplane !== store.ui.selected.plane) {
        store.addHistory();
      }
    }
  };

  @action
  stopMoving = () => {
    if (store.state.mode === 'moving' && store.state.currentActivity.wasMoved) {
      if (
        store.state.currentActivity.startTime !== store.state.initialStartTime
      ) {
        store.state = { mode: 'normal' };
        store.ui.cancelScroll();
        store.addHistory();
      } else {
        store.state.currentActivity.select();
        store.ui.cancelScroll();
        store.state = { mode: 'normal' };
      }
    }
  };

  @action
  stopResizing = () => {
    store.state = { mode: 'normal' };
    store.ui.cancelScroll();
    store.addHistory();
  };

  @action
  mongoAdd = (x: any) => {
    if (!store.findId({ type: 'activity', id: x._id })) {
      this.all.push(
        new Activity(x.plane, x.startTime, x.title, x.length, x._id, x.state)
      );
    }
  };

  @action
  mongoChange = (newact: any, oldact: any) => {
    const toUpdate = store.findId({ type: 'activity', id: oldact._id });
    if (!toUpdate) {
      throw 'Could not find activity to update in Mongo';
    }
    toUpdate.update(newact);
  };

  @action
  mongoRemove = (remact: any) => {
    this.all = this.all.filter(x => x.id !== remact._id);
  };

  @computed
  get mongoObservers(): Object {
    return {
      added: this.mongoAdd,
      changed: this.mongoChange,
      removed: this.mongoRemove
    };
  }

  @computed
  get history(): Array<any> {
    return this.all.map(x => ({ ...omit(x, 'over') }));
  }

  @computed
  get furthestActivity(): number {
    const max = maxBy(this.all, x => x.startTime + x.length);
    return max && Math.ceil(max.startTime + max.length);
  }
}
