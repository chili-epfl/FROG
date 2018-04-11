import { Meteor } from 'meteor/meteor';
import { set, cloneDeep, isEqual } from 'lodash';
import { uuid } from 'frog-utils';

import { activityTypesObj } from '../imports/activityTypes';
import { DashboardData } from '../imports/api/activities';
import { DashboardStates } from './cache';
import { regenerateState } from './mergeLogData';

const interval = {};
const subscriptions = {};
const oldState = {};
const oldInput = {};

const update = (that, dashId, func) => {
  if (!isEqual(oldInput[dashId], DashboardStates[dashId])) {
    const newState = func(cloneDeep(DashboardStates[dashId]));
    that.changed('dashboard', dashId, newState);
    oldState[dashId] = newState;
    oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
  }
};

export default () => {
  Meteor.publish('dashboard', function(activityId, activityType, dashboard) {
    const id = uuid();
    const dashId = activityId + '-' + dashboard;
    if (DashboardStates[dashId] === undefined) {
      const archived = DashboardData.findOne({ dashId });
      if (archived) {
        this.added('dashboard', dashId, archived.data);
        this.ready();
        return;
      } else {
        regenerateState(activityType, activityId, dashboard);
      }
    }
    set(subscriptions, [dashId, id], true);
    const func =
      activityTypesObj[activityType].dashboard[dashboard].prepareDisplay;
    const newState = func(cloneDeep(DashboardStates[dashId]));
    this.added('dashboard', dashId, newState);
    oldState[dashId] = newState;
    oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
    if (!interval[dashId]) {
      interval[dashId] = setInterval(() => update(this, dashId, func), 1000);
    }
    this.ready();
    this.onStop(() => {
      delete subscriptions[dashId][id];
      if (Object.keys(subscriptions[dashId]).length === 0) {
        clearInterval(interval[dashId]);
        interval[dashId] = false;
      }
    });
  });
};
