// @flow

import { Meteor } from 'meteor/meteor';
import { cloneDeep } from 'lodash';
import { generateReactiveFn } from 'frog-utils';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';

Meteor.methods({
  'merge.log': (payload, activity, instanceId) => {
    const doc = serverConnection.get('rz', activity._id + '//DASHBOARD');
    doc.fetch();
    doc.on('load', () => {
      const dataFn = generateReactiveFn(doc);
      const aT = activityTypesObj[activity.activityType];
      if (aT.dashboard && aT.dashboard.mergeLog) {
        aT.dashboard.mergeLog(cloneDeep(doc.data), dataFn, {
          instanceId,
          payload
        });
      }
      doc.destroy();
    });
  }
});
