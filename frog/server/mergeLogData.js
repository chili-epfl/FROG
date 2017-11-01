// @flow

import { Meteor } from 'meteor/meteor';
import { cloneDeep } from 'lodash';
import { generateReactiveFn, type LogDBT } from 'frog-utils';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';
import { Logs } from '../imports/api/logs';
import { Cache } from './sharedbCache';

Meteor.methods({
  'merge.log': (log: LogDBT) => {
    try {
      Logs.insert(log);

      if (log.activityType && log.activityId) {
        const aT = activityTypesObj[log.activityType];

        if (aT.dashboard && aT.dashboard.mergeLog) {
          const docId = 'DASHBOARD//' + log.activityId;
          if (Cache[docId]) {
            const [doc, dataFn] = Cache[docId];
            aT.dashboard.mergeLog(cloneDeep(doc.data), dataFn, log);
          } else {
            const prepareDoc = doctmp => {
              const dataFn = generateReactiveFn(doctmp);
              Cache[docId] = [doctmp, dataFn];
              if (aT.dashboard && aT.dashboard.mergeLog) {
                aT.dashboard.mergeLog(cloneDeep(doctmp.data), dataFn, log);
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
  }
});
