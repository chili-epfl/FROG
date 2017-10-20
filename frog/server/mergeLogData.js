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
    Logs.insert(log);

    if (log.activityType && log.activityId) {
      const aT = activityTypesObj[log.activityType];

      if (aT.dashboard && aT.dashboard.mergeLog) {
        const docId = 'DASHBOARD//' + log.activityId;
        if (Cache[docId]) {
          const [doc, dataFn] = Cache[docId];
          aT.dashboard.mergeLog(cloneDeep(doc.data), dataFn, log);
        } else {
          const doc = serverConnection.get('rz', docId);
          doc.fetch();
          doc.once('load', () => {
            const dataFn = generateReactiveFn(doc);
            Cache[docId] = [doc, dataFn];
            if (aT.dashboard && aT.dashboard.mergeLog) {
              aT.dashboard.mergeLog(cloneDeep(doc.data), dataFn, log);
            }
          });
        }
      }
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
