// @flow

import { Meteor } from 'meteor/meteor';
import { cloneDeep } from 'lodash';
import {
  generateReactiveFn,
  getMergedExtractedUnit,
  type ObjectT
} from 'frog-utils';
import { Activities } from '../imports/api/activities';
import doGetInstances from '../imports/api/doGetInstances';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';

export default (activityId: string, object: ObjectT) => {
  console.log('merging', activityId);
  const { activityData } = object;
  const activity = Activities.findOne(activityId);

  const { groups, structure } = doGetInstances(activity, object);
  console.log('g/s', groups, structure);
  groups.forEach(grouping => {
    if (activity.hasMergedData && activity.hasMergedData[grouping]) {
      console.log('has merged', activityId);
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
          doc.create(
            activityType.dataStructure !== undefined
              ? cloneDeep(activityType.dataStructure)
              : {}
          );
        }
        if (mergeFunction) {
          const dataFn = generateReactiveFn(doc);
          // merging in config with incoming product
          const instanceActivityData = getMergedExtractedUnit(
            activity.data,
            activityData,
            structure,
            grouping,
            object.socialStructure
          );
          if (instanceActivityData) {
            mergeFunction(instanceActivityData, dataFn);
          }
        }
      })
    );
  });
};
