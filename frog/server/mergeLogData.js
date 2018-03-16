// @flow

import { Meteor } from 'meteor/meteor';
import { cloneDeep } from 'lodash';
import { generateReactiveFn, type LogDBT } from 'frog-utils';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';
import { Logs } from '../imports/api/logs';
import { Cache } from './sharedbCache';
import { Activities } from '../imports/api/activities.js';

const activityCache = {};

Meteor.methods({
  'merge.log': (rawLog: LogDBT | LogDBT[], logExtra) => {
    const logs = Array.isArray(rawLog) ? rawLog : [rawLog];
    logs.forEach(eachLog => {
      const log = { ...logExtra, ...eachLog, timestamp: new Date() };
      try {
        Logs.insert(log);

        if (log.activityType && log.activityId) {
          const aT = activityTypesObj[log.activityType];

          if (!activityCache[log.activityId]) {
            activityCache[log.activityId] = Activities.findOne(log.activityId);
          }
          const activity = activityCache[log.activityId];

          if (aT.dashboard && aT.dashboard.mergeLog) {
            const docId = 'DASHBOARD//' + log.activityId;
            if (Cache[docId]) {
              const [doc, dataFn] = Cache[docId];
              aT.dashboard.mergeLog(cloneDeep(doc.data), dataFn, log, activity);
            } else {
              const prepareDoc = doctmp => {
                const dataFn = generateReactiveFn(doctmp);
                Cache[docId] = [doctmp, dataFn];
                if (aT.dashboard && aT.dashboard.mergeLog) {
                  aT.dashboard.mergeLog(
                    cloneDeep(doctmp.data),
                    dataFn,
                    log,
                    activity
                  );
                }
              };

              const doc = serverConnection.get('rz', docId);
              doc.fetch();
              if (doc.type) {
                prepareDoc(doc);
              } else {
                doc.once('load', () => {
                  prepareDoc(doc);
                });
              }
            }
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(log, e);
      }
    });
  }
});

Meteor.methods({
  'session.logs': function(sessionId, limit = 50) {
    if (
      this.userId &&
      Meteor.users.findOne(this.userId).username === 'teacher'
    ) {
      return Logs.find({ sessionId }, { limit }).fetch();
    }
  },
  'session.find_start': function(sessionId) {
    if (
      this.userId &&
      Meteor.users.findOne(this.userId).username === 'teacher'
    ) {
      return Logs.findOne({ sessionId }, { sort: { timestamp: -1 } }).timestamp;
    }
  },
  'get.example.logs': function(ac, idx) {
    const rootPath = resolve('.').split('/.meteor')[0];
    const d = activityTypesObj[ac].dashboard;
    const examplePath =
      d && d.exampleLogs && d.exampleLogs[idx] && d.exampleLogs[idx].path;
    if (examplePath) {
      const log = readFileSync(
        join(rootPath, '..', 'ac', ac, examplePath),
        'utf-8'
      );

      return log
        .trim()
        .split('\n')
        .map(x => JSON.parse(x));
    } else {
      return false;
    }
  }
});
