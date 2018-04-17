// @flow

import { Meteor } from 'meteor/meteor';
import { set, isEqual } from 'lodash';
import { uuid, cloneDeep, values } from 'frog-utils';

import { activityTypesObj } from '../imports/activityTypes';
import { DashboardData } from '../imports/api/activities';
import { DashboardStates } from '../imports/api/cache';
import { regenerateState } from '../imports/api/mergeLogData';

const interval = {};
const subscriptions = {};
const oldState = {};
const oldInput = {};

const updateAndSend = (dashId, prepareDataForDisplayFn) => {
  if (!isEqual(oldInput[dashId], DashboardStates[dashId])) {
    const newState = prepareDataForDisplayFn
      ? prepareDataForDisplayFn(cloneDeep(DashboardStates[dashId]))
      : DashboardStates[dashId];
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
    if (DashboardStates[dashId] === undefined) {
      const archived = DashboardData.findOne({ dashId });
      if (archived) {
        this.added('dashboard', dashId, archived.data);
        this.ready();
        return;
      } else {
        regenerateState(activityTypesObj[activityType], activityId, dashboard);
      }
    }
    set(subscriptions, [dashId, id], this);
    const prepareDataForDisplayFn =
      activityTypesObj[activityType].dashboards[dashboard].prepareDisplay;
    const newState = prepareDataForDisplayFn
      ? prepareDataForDisplayFn(cloneDeep(DashboardStates[dashId]))
      : DashboardStates[dashId];
    this.added('dashboard', dashId, newState);
    oldState[dashId] = newState;
    oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
    if (!interval[dashId]) {
      interval[dashId] = setInterval(
        () => updateAndSend(dashId, prepareDataForDisplayFn),
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
