// @flow

import { Meteor } from 'meteor/meteor';
import { extractUnit, type ObjectT } from 'frog-utils';
import { Activities, getInstances } from '../imports/api/activities';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';
import generateReactiveFn from '../imports/api/generateReactiveFn';

export default (activityId: string, object: ObjectT) => {
  const { activityData } = object;
  const activity = Activities.findOne(activityId);

  const [groups, activityStructure] = getInstances(activityId);
  groups.forEach(grouping => {
    if (activity.hasMergedData && activity.hasMergedData[grouping]) {
      return;
    }
    Activities.update(activityId, {
      $set: {
        hasMergedData: { ...(activity.hasMergedData || {}), [grouping]: true }
      }
    });
    const activityType = activityTypesObj[activity.activityType];
    const mergeFunction = activityType.mergeFunction;
    const doc = serverConnection.get('rz', activityId + '/' + grouping);
    doc.fetch();
    doc.on(
      'load',
      Meteor.bindEnvironment(() => {
        if (!doc.type) {
          doc.create(activityType.dataStructure || {});
        }
        if (mergeFunction) {
          const dataFn = generateReactiveFn(doc);
          // merging in config with incoming product
          const product = extractUnit(
            activityData,
            activityStructure,
            grouping
          );
          if (product) {
            mergeFunction(product, dataFn);
          }
        }
      })
    );
  });
};
