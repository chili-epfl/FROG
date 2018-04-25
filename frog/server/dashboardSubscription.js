// @flow

import { Meteor } from 'meteor/meteor';
import { set, isEqual } from 'lodash';
import { uuid, cloneDeep, values } from 'frog-utils';

import { activityTypesObj } from '../imports/activityTypes';
import { DashboardData, Activities } from '../imports/api/activities';
import { DashboardStates } from '../imports/api/cache';
import { regenerateState } from '../imports/api/mergeLogData';

const interval = {};
const subscriptions = {};
const oldState = {};
const oldInput = {};

const updateAndSend = (dashId, prepareDataForDisplayFn, activity) => {
  if (!isEqual(oldInput[dashId], DashboardStates[dashId])) {
    const dashState = cloneDeep(DashboardStates[dashId]);
    const newState = prepareDataForDisplayFn(dashState, activity);
    values(subscriptions[dashId]).forEach(that => {
      that.changed('dashboard', dashId, newState);
    });
    oldState[dashId] = newState;
    oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
  }
};

export default () => {
  Meteor.publish('dashboard', function(activityId, activityType, dashboard) {
    const id = uuid();
    const dashId = activityId + '-' + dashboard;
    const aT = activityTypesObj[activityType];
    const act = Activities.findOne(activityId);
    if (DashboardStates[dashId] === undefined) {
      const archived = DashboardData.findOne({ dashId });
      if (archived) {
        this.added('dashboard', dashId, archived.data);
        this.ready();
        return;
      } else {
        regenerateState(aT, activityId, dashboard);
      }
    }
    set(subscriptions, [dashId, id], this);
    const aTDash = aT.dashboards[dashboard];
    const prepDataForDisplayFn = aTDash.prepareDataForDisplay || ((x, _) => x);
    const dashState = cloneDeep(DashboardStates[dashId]);
    const newState = prepDataForDisplayFn(dashState, act);
    this.added('dashboard', dashId, newState);
    oldState[dashId] = newState;
    oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
    if (!interval[dashId]) {
      interval[dashId] = setInterval(
        () => updateAndSend(dashId, prepDataForDisplayFn, act),
        1000
      );
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
