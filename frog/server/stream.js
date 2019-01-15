// @flow

import { Meteor } from 'meteor/meteor';

import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import { Activities } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';
import { SharedbCache } from '/imports/api/cache';
import { serverConnection } from './share-db-manager';

Meteor.methods({
  stream: (activity, instanceId, value) => {
    if (activity.streamTarget) {
      const user = Meteor.users.findOne(Meteor.userId());
      const target = Activities.findOne(activity.streamTarget);
      const docId = activity.streamTarget + '/all';
      const mergeFunction = activityTypesObj[target.activityType].mergeFunction;
      if (!mergeFunction) {
        return;
      }
      const toSend = {
        data: { '1': { ...value, id: '1' } },
        config: target.data
      };

      if (SharedbCache[docId]) {
        const [dataFn] = SharedbCache[docId];
        mergeFunction(toSend, dataFn, dataFn.doc.data, user);
      } else {
        const doc = serverConnection.get('rz', docId);
        doc.subscribe();
        if (doc.type) {
          const dataFn = generateReactiveFn(doc);
          SharedbCache[docId] = [dataFn];
          mergeFunction(toSend, dataFn, dataFn.doc.data, user);
        } else {
          doc.once('load', () => {
            const dataFn = generateReactiveFn(doc);
            SharedbCache[docId] = [dataFn];
            mergeFunction(toSend, dataFn, dataFn.doc.data, user);
          });
        }
      }
    }
  }
});
