// @flow

import { Meteor } from 'meteor/meteor';
import { cloneDeep } from 'lodash';
import {
  generateReactiveFn,
  getMergedExtractedUnit,
  type ObjectT
} from 'frog-utils';
import { Activities } from '../imports/api/activities';
import { Objects } from '../imports/api/objects';
import doGetInstances from '../imports/api/doGetInstances';
import { Sessions } from '../imports/api/sessions';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';

const mergeData = (activityId: string, object: ObjectT, group?: string) => {
  const { activityData } = object;
  const activity = Activities.findOne(activityId);
  const activityType = activityTypesObj[activity.activityType];

  const { groups, structure } = doGetInstances(activity, object);
  const createGroups = group ? [group] : groups;

  createGroups.forEach(grouping => {
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
      mergedLogsDoc.create({});
      const dataFn = generateReactiveFn(mergedLogsDoc);
      if (activityType.dashboard) {
        activityType.dashboard.initData(dataFn, structure, groups);
      }
    }
    mergedLogsDoc.destroy();
  });
};

export default mergeData;

Meteor.methods({
  'ensure.reactive': (sessionId, studentId) => {
    const session = Sessions.findOne(sessionId);
    const activities = session.openActivities
      ? Activities.find({
          _id: { $in: session.openActivities },
          plane: 1
        })
      : [];
    activities.forEach(ac => {
      const object = Objects.findOne(ac._id);
      if (!object.globalStructure.studentIds.includes(studentId)) {
        Objects.update(ac._id, {
          $push: { 'globalStructure.studentIds': studentId }
        });
        Objects.update(ac._id, {
          $set: {
            ['globalStructure.students.' + studentId]: Meteor.user().username
          }
        });
      }
      mergeData(ac._id, object, studentId);
    });
  }
});
