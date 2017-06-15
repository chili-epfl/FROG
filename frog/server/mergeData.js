// @flow

import { Meteor } from 'meteor/meteor';
import { merge } from 'lodash';
import type { activityDataT, ObjectT } from 'frog-utils';

import { activityTypesObj } from '../imports/activityTypes';
import generateReactiveFn from '../imports/api/generateReactiveFn';

export default (activityId: string, object: ObjectT) => {
  const { socialStructure, globalStructure, activityData } = object;
  const activity = Activities.findOne(activityId);

  let groups;
  if (activity.grouping && socialStructure[activity.grouping]) {
    groups = Object.keys(socialStructure[activity.grouping]);
  } else {
    groups = ['all'];
  }
  groups.forEach(grouping => {
    if (
      (activity.hasMergedData && activity.hasMergedData[grouping]) ||
      (globalState[activityId] && globalState[activityId][grouping])
    ) {
      return;
    }
    globalState[activityId] = { ...globalState[activityId], [grouping]: true };
    // the reason for using globalState is that without transactions, just checking the database
    // would sometimes lead to the same thing being done twice. this is still not fool-proof,
    // probably the safest would be for all actions to be triggered by the engine, not by
    // browsers.
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
          let prod;
          if (!object.products) {
            prod = null;
          } else if (object.products.all) {
            prod = object.products.all;
          } else if (object.products[grouping]) {
            prod = object.products[grouping];
          } else {
            console.error('No product matching grouping');
          }
          const newObject = {
            globalStructure,
            socialStructure,
            products: merge(prod)
          };
          log('newObject', newObject);
          mergeFunction(newObject, dataFn);
        }
      })
    );
  });
};
