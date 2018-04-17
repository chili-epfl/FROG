// @flow
import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
import { cloneDeep } from 'lodash';
import {
  generateReactiveFn,
  getMergedExtractedUnit,
  type ObjectT,
  type GlobalStructureT,
  type ActivityDbT,
  type structureDefT
} from 'frog-utils';
import { Activities } from '../imports/api/activities';
import { Objects } from '../imports/api/objects';
import doGetInstances from '../imports/api/doGetInstances';
import { Sessions } from '../imports/api/sessions';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';
import { createDashboards } from '../imports/api/mergeLogData';

declare var Promise: any;
const backend = new ShareDB();
const connection = backend.connect();

export const mergeOneInstance = (
  grouping: string,
  activity: ActivityDbT,
  dataStructure: any,
  mergeFunction: ?Function,
  activityData: Object,
  structure: structureDefT,
  object: Object,
  providedInstanceActivityData?: any,
  docId?: string
) => {
  let data;
  if (mergeFunction) {
    const instanceActivityData =
      providedInstanceActivityData !== undefined // allows it to be null and still picked up
        ? providedInstanceActivityData
        : getMergedExtractedUnit(
            activity.data,
            activityData,
            structure,
            grouping,
            object.socialStructure
          );
    if (instanceActivityData) {
      data = Promise.await(
        new Promise(resolve => {
          const doc = connection.get(
            'rz',
            docId || activity._id + '/' + grouping
          );
          doc.fetch();
          doc.once(
            'load',
            Meteor.bindEnvironment(() => {
              try {
                doc.create(
                  dataStructure !== undefined ? cloneDeep(dataStructure) : {}
                );
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error(
                  Date.now(),
                  'Creating collection for ',
                  docId || [activity._id, grouping].join('/'),
                  e
                );
              }

              const dataFn = generateReactiveFn(doc);
              // merging in config with incoming product
              if (mergeFunction) {
                mergeFunction(instanceActivityData, dataFn);
              }
              const docdata = doc.data;
              doc.destroy();
              resolve(docdata);
            })
          );
        }).catch(e => console.error(e))
      );
    }
  } else {
    data = dataStructure || {};
  }

  const serverDoc = serverConnection.get(
    'rz',
    docId || activity._id + '/' + grouping
  );
  try {
    serverDoc.create(data, undefined, undefined, err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(
          Date.now(),
          'Creating ShareDB document',
          docId || [activity._id + '/' + grouping].join('/'),
          err
        );
      }
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      Date.now(),
      'Catch: Creating ShareDB document for ',
      activity._id,
      grouping,
      e
    );
  }
};

const mergeData = (
  activityId: string,
  object: ObjectT & GlobalStructureT,
  group?: string
) => {
  const { activityData } = object;
  const activity = Activities.findOne(activityId);
  const activityType = activityTypesObj[activity.activityType];

  const { groups, structure } = doGetInstances(activity, object);
  const createGroups = group ? [group] : groups;

  const mergeFunction = activityType.mergeFunction;
  const asyncCreates = createGroups.map(grouping =>
    mergeOneInstance(
      grouping,
      activity,
      activityType.dataStructure,
      mergeFunction,
      activityData,
      structure,
      object
    )
  );
  Promise.await(Promise.all(asyncCreates));

  // only create dashboard on initial merge, not when called by individuals joining late
  if (!group) {
    createDashboards(activity);
  }
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
