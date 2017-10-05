// @flow
import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
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

declare var Promise: any;

const mergeOneInstance = (
  grouping,
  activity,
  dataStructure,
  mergeFunction,
  activityData,
  structure,
  object,
  connection
) => {
  let data;
  if (mergeFunction) {
    const instanceActivityData = getMergedExtractedUnit(
      activity.data,
      activityData,
      structure,
      grouping,
      object.socialStructure
    );
    if (instanceActivityData) {
      data = Promise.await(
        new Promise(resolve => {
          const doc = connection.get('rz', activity._id + '/' + grouping);
          doc.fetch();
          doc.on(
            'load',
            Meteor.bindEnvironment(() => {
              if (!doc.type) {
                doc.create(
                  dataStructure !== undefined ? cloneDeep(dataStructure) : {}
                );
              }
              const dataFn = generateReactiveFn(doc);
              // merging in config with incoming product
              mergeFunction(instanceActivityData, dataFn);
              resolve(doc.data);
            })
          );
        })
      );
    }
  } else {
    data = dataStructure;
  }

  const serverDoc = serverConnection.get('rz', activity._id + '/' + grouping);
  serverDoc.create(data, undefined, undefined, err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(
        'Creating ShareDB document',
        activity._id + '/' + grouping,
        err
      );
    }
  });
};

const mergeData = (activityId: string, object: ObjectT, group?: string) => {
  const startTime = Date.now();
  const { activityData } = object;
  const activity = Activities.findOne(activityId);
  const activityType = activityTypesObj[activity.activityType];

  const { groups, structure } = doGetInstances(activity, object);
  const createGroups = group ? [group] : groups;
  const backend = new ShareDB();
  const connection = backend.connect();

  const mergeFunction = activityType.mergeFunction;
  const asyncCreates = createGroups.map((grouping, i) =>
    mergeOneInstance(
      grouping,
      activity,
      activityType.dataStructure,
      mergeFunction,
      activityData,
      structure,
      object,
      connection
    )
  );
  Promise.await(Promise.all(asyncCreates));

  const mergedLogsDoc = serverConnection.get('rz', 'DASHBOARD//' + activityId);
  mergedLogsDoc.fetch();
  mergedLogsDoc.on('load', () => {
    if (!mergedLogsDoc.type) {
      mergedLogsDoc.create(
        (activityType.dashboard && activityType.dashboard.initData) || {}
      );
    }
    mergedLogsDoc.destroy();
  });

  console.log('Merging data elapsed', activityId, Date.now() - startTime);
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
