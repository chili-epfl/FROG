// @flow

import { Meteor } from 'meteor/meteor';
import { type ActivityDbT, type ActivityPackageT } from 'frog-utils';
import { cloneDeep } from 'lodash';

import { activityTypesObj } from '../activityTypes';
import { Logs } from './logs';
import { DashboardStates } from './cache';
import { Activities, DashboardData } from './activities.js';

const activityCache = {};

export const createDashboards = (
  activity: { activityType: string, _id: string },
  refresh: boolean = false
) => {
  const aT = activityTypesObj[activity.activityType];
  if (aT.dashboards) {
    Object.keys(aT.dashboards).forEach(dash =>
      initializeDashboardState(aT, activity._id, dash, refresh)
    );
  }
};

export const initializeDashboardState = (
  activityType: ActivityPackageT,
  activityId: string,
  name: string,
  refresh: boolean = false
) => {
  const dashId = activityId + '-' + name;
  if (!DashboardStates[dashId] || refresh) {
    DashboardStates[dashId] =
      cloneDeep(activityType.dashboards[name].initData) || {};
  }
};

export const regenerateState = (
  activityType: ActivityPackageT,
  activityId: string,
  name: string
) => {
  const dashId = activityId + '-' + name;
  if (!DashboardStates[dashId]) {
    initializeDashboardState(activityType, activityId, name);
    const logs = Logs.find({ activityId }).fetch();
    const mergeLogFn = activityType.dashboards[name].mergeLog;
    if (!activityCache[activityId]) {
      activityCache[activityId] = Activities.findOne(activityId);
    }
    const activity = activityCache[activityId];
    logs.forEach(log =>
      mergeLogFn(DashboardStates[log.activityId + '-' + name], log, activity)
    );
  }
};

export const mergeLog = (
  rawLog: Object | Object[],
  logExtra: Object,
  suppliedActivity?: Object
) => {
  const logs = Array.isArray(rawLog) ? rawLog : [rawLog];
  logs.forEach(eachLog => {
    const log = { ...logExtra, ...eachLog, timestamp: new Date() };
    try {
      Logs.insert(log);
      if (log.activityType && log.activityId) {
        const aT = activityTypesObj[log.activityType];
        if (aT.dashboards) {
          if (!activityCache[log.activityId] && !suppliedActivity) {
            activityCache[log.activityId] = Activities.findOne(log.activityId);
          }
          const activity = suppliedActivity || activityCache[log.activityId];
          Object.keys(aT.dashboards).forEach(name => {
            const mergeLogFn = aT.dashboards[name].mergeLog;
            if (mergeLogFn) {
              if (!DashboardStates[log.activityId + '-' + name]) {
                regenerateState(aT, log.activityId, name);
              }
              mergeLogFn(
                DashboardStates[log.activityId + '-' + name],
                log,
                activity
              );
            }
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(log, e);
    }
  });
};

const archiveDashboardState = activityId => {
  const act = Activities.findOne(activityId);
  const aT = activityTypesObj[act.activityType];
  if (aT.dashboards) {
    Object.keys(aT.dashboards).forEach(dash => {
      const dashId = activityId + '-' + dash;
      if (DashboardStates[dashId]) {
        const prepDataFn =
          aT.dashboards[dash].prepareDataForDisplay || ((x, _) => x);
        DashboardData.insert({
          dashId,
          data: prepDataFn(DashboardStates[dashId], act)
        });
        DashboardStates[dashId] = undefined;
      }
    });
  }
};

Meteor.methods({
  'merge.log': mergeLog,
  'archive.dashboard.state': archiveDashboardState
});
