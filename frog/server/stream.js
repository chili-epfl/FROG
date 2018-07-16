// @flow

import { Meteor } from 'meteor/meteor';
import { generateReactiveFn } from 'frog-utils';

import { Activities } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';
import { serverConnection } from './share-db-manager';
import { SharedbCache } from '../imports/api/cache';
import LearningItem from '../imports/ui/LearningItem';

Meteor.methods({
  stream: (activity, instanceId, value) => {
    if (activity.streamTarget) {
      const target = Activities.findOne(activity.streamTarget);
      const docId = activity.streamTarget + '/all';
      const mergeFunction = activityTypesObj[target.activityType].mergeFunction;
      if (!mergeFunction) {
        return;
      }
      const toSend = {
        data: { '1': { ...value, id: '1' } },
        config: {}
      };
      if (SharedbCache[docId]) {
        const [dataFn] = SharedbCache[docId];
        mergeFunction(toSend, dataFn);
      } else {
        const doc = serverConnection.get('rz', docId);
        doc.subscribe();
        if (doc.type) {
          const dataFn = generateReactiveFn(doc, LearningItem);
          SharedbCache[docId] = [dataFn];
          mergeFunction(toSend, dataFn);
        } else {
          doc.once('load', () => {
            const dataFn = generateReactiveFn(doc, LearningItem);
            SharedbCache[docId] = [dataFn];
            mergeFunction(toSend, dataFn);
          });
        }
      }
    }
  }
});
