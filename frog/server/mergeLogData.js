// @flow

import { Meteor } from 'meteor/meteor';

import { activityTypesObj } from '../imports/activityTypes';
import { Logs } from '../imports/api/logs';
import { DashboardStates } from './cache';
import { Activities } from '../imports/api/activities.js';

const activityCache = {};

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
                DashboardStates[log.activityId + '-' + name] =
                  aT.dashboard[name].initData || {};
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
