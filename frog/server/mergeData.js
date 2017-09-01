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
  const { activityData } = object;
  const activity = Activities.findOne(activityId);
  const activityType = activityTypesObj[activity.activityType];

  const { groups, structure } = doGetInstances(activity, object);
  groups.forEach(grouping => {
    if (activity.hasMergedData && activity.hasMergedData[grouping]) {
      return;
    }
    Activities.update(activityId, {
      $set: {
        hasMergedData: { ...(activity.hasMergedData || {}), [grouping]: true }
      }
    });
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
  const mergedLogsDoc = serverConnection.get('rz', activityId + '//DASHBOARD');
  mergedLogsDoc.fetch();
  mergedLogsDoc.on('load', () => {
    if (!mergedLogsDoc.type) {
      mergedLogsDoc.create(
        (activityType.dashboard && activityType.dashboard.initData) || {}
      );
    }
    mergedLogsDoc.destroy();
  });
};
