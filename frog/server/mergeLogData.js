// @flow

import { Meteor } from 'meteor/meteor';

import { activityTypesObj } from '../imports/activityTypes';
import { Logs } from '../imports/api/logs';
import { DashboardStates } from './cache';
import { Activities } from '../imports/api/activities.js';

const activityCache = {};
export const regenerateState = (
  activityType: string,
  activityId: string,
  name: string
) => {
  const dashId = activityId + '-' + name;
  if (!DashboardStates[dashId]) {
    if (!activityCache[activityId]) {
      activityCache[activityId] = Activities.findOne(activityId);
    }
    const activity = activityCache[activityId];
    const aT = activityTypesObj[activityType];
    DashboardStates[dashId] = aT.dashboard[name].initData || {};
    const logs = Logs.find({ activityId }).fetch();
    const mergeLogFn = aT.dashboard[name].mergeLog;
    logs.forEach(log =>
      mergeLogFn(DashboardStates[log.activityId + '-' + name], log, activity)
    );
  }
};

const mergeLog = (rawLog, logExtra) => {
  const logs = Array.isArray(rawLog) ? rawLog : [rawLog];
  logs.forEach(eachLog => {
    const log = { ...logExtra, ...eachLog, timestamp: new Date() };
    try {
      Logs.insert(log);
      if (log.activityType && log.activityId) {
        const aT = activityTypesObj[log.activityType];
        if (aT.dashboard) {
          if (!activityCache[log.activityId]) {
            activityCache[log.activityId] = Activities.findOne(log.activityId);
          }
          const activity = activityCache[log.activityId];
          Object.keys(aT.dashboard).forEach(name => {
            const mergeLogFn = aT.dashboard[name].mergeLog;
            if (mergeLogFn) {
              if (!DashboardStates[log.activityId + '-' + name]) {
                regenerateState(activity.activityType, log.activityId, name);
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

Meteor.methods({
  'merge.log': mergeLog
});
