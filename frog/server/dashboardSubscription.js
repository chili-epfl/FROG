// @flow

import { Meteor } from 'meteor/meteor';
import { set } from 'lodash';
import { uuid, cloneDeep, values, type ActivityDbT } from 'frog-utils';

import { activityTypesObj } from '../imports/activityTypes';
import { DashboardData, Activities } from '../imports/api/activities';
import { DashboardStates } from '../imports/api/cache';
import { regenerateState } from '../imports/api/mergeLogData';
import { serverConnection } from './share-db-manager';

const interval = {};
const subscriptions = {};
const oldInput = {};
export const activityQuery = {};

export const ensureReactiveSubscription = (activityId: string) => {
  if (!activityQuery[activityId]) {
    activityQuery[activityId] = serverConnection.createSubscribeQuery('rz', {
      _id: { $regex: '^' + activityId }
    });
  }
};

Meteor.methods({
  'ensure.dashboard.reactive.subscription': ensureReactiveSubscription
});

export const reactiveWrapper = (act: any, dashboard: any) => (
  _: any,
  __: any
): any => {
  if (!activityQuery[act._id]?.ready) {
    return null;
  }
  const data = (activityQuery[act._id].results || []).reduce(
    (acc, res) => ({
      ...acc,
      [res.id.split('/')[1]]: res.data
    }),
    {}
  );

  return dashboard.reactiveToDisplay(data, act);
};

const updateAndSend = (
  dashId,
  prepareDataForDisplayFn,
  activity: ActivityDbT
) => {
  const dashState = cloneDeep(DashboardStates[dashId]);
  const newState = prepareDataForDisplayFn(dashState, activity);
  values(subscriptions[dashId]).forEach(that => {
    that.changed('dashboard', dashId, { data: newState });
  });
  oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
};

export default () => {
  Meteor.publish('dashboard', function(
    activityId,
    activityType,
    dashboard,
    config
  ) {
    const id = uuid();
    const dashId = activityId + '-' + dashboard;
    const archived = DashboardData.findOne({ dashId });
    if (archived) {
      this.added('dashboard', dashId, { data: archived.data });
      this.ready();
      return;
    }
    const aT = activityTypesObj[activityType];
    const act: ActivityDbT = config
      ? {
          _id: activityId,
          data: config,
          activityType: 'none',
          length: 5,
          startTime: 0
        }
      : Activities.findOne(activityId);
    if (DashboardStates[dashId] === undefined) {
      regenerateState(aT, activityId, dashboard);
    }
    set(subscriptions, [dashId, id], this);
    const aTDash = (aT.dashboards && aT.dashboards[dashboard]) || {};
    let prepDataForDisplayFn;
    if (aTDash.prepareDataForDisplay) {
      prepDataForDisplayFn = aTDash.prepareDataForDisplay;
    } else if (aTDash.reactiveToDisplay) {
      ensureReactiveSubscription(act._id);
      prepDataForDisplayFn = reactiveWrapper(act, aTDash);
    } else {
      prepDataForDisplayFn = (x, _) => x;
    }
    const dashState = cloneDeep(DashboardStates[dashId]);
    const newState = prepDataForDisplayFn(dashState, act);
    this.added('dashboard', dashId, { data: newState });
    oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
    if (!interval[dashId]) {
      updateAndSend(dashId, prepDataForDisplayFn, act);
      interval[dashId] = setInterval(
        () => updateAndSend(dashId, prepDataForDisplayFn, act),
        5000
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

export const archiveDashboardState = (activityId: string) => {
  if (!Meteor.settings.sendLogsToExternalDashboardServer) {
    const act = Activities.findOne(activityId);
    if (!act) {
      console.error(
        'archiveDashboardState error, missing activity',
        activityId
      );
      return;
    }
    const aT = activityTypesObj[act.activityType];
    if (aT.dashboards) {
      Object.keys(aT.dashboards).forEach(name => {
        const dashId = activityId + '-' + name;
        const aTDash = aT.dashboards && aT.dashboards[name];
        if (DashboardStates[dashId] || aTDash?.reactiveToDisplay) {
          let prepDataForDisplayFn = (x, _) => x;
          const prepare = aTDash?.prepareDataForDisplay;
          if (prepare) {
            prepDataForDisplayFn = prepare;
          } else if (aTDash?.reactiveToDisplay) {
            prepDataForDisplayFn = reactiveWrapper(act, aTDash);
          }
          DashboardData.insert({
            dashId,
            data: prepDataForDisplayFn(DashboardStates[dashId], act)
          });
        }
      });
    }
  }
};
