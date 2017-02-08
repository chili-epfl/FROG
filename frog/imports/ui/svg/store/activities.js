// @flow
import Activity from './activity'
import { computed, action, observable } from 'mobx';
import { store } from './store'

// find activities immediately to the left and to the right of the current activity
// to draw boundary markers and control movement by dragging and resizing
const calculateBounds = (activity: Activity, activities: Array<Activity>) => {
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
    return ({
      added: this.mongoAdd,
      changed: this.mongoChange,
      removed: this.mongoRemove
    })
  }

  @computed get history(): Array<any> {
    return this.all.map(x => ({...x}))
  }
}
