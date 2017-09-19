// @flow

import { Meteor } from 'meteor/meteor';
import { cloneDeep } from 'lodash';
import { generateReactiveFn } from 'frog-utils';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';
import { Logs } from '../imports/api/logs';

Meteor.methods({
  'merge.log': log => {
    Logs.insert(log);
    if (log.activityId) {
      const doc = serverConnection.get('rz', log.activityId + '//DASHBOARD');
      doc.fetch();
      doc.on('load', () => {
        const dataFn = generateReactiveFn(doc);
        const aT = activityTypesObj[log.activityType];
        if (aT.dashboard && aT.dashboard.mergeLog) {
          aT.dashboard.mergeLog(cloneDeep(doc.data), dataFn, log);
        }
        doc.destroy();
      });
    }
  }
});
