// @flow
import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
import { cloneDeep } from 'lodash';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';

import {
  getMergedExtractedUnit,
  type ObjectT,
  type GlobalStructureT,
  type ActivityDbT,
  type structureDefT,
  uuid
} from 'frog-utils';
import { Activities } from '../imports/api/activities';
import { Objects } from '../imports/api/objects';
import doGetInstances from '../imports/api/doGetInstances';
import { Sessions } from '../imports/api/sessions';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';
import { createDashboards } from '../imports/api/mergeLogData';

declare var Promise: any;
const backend = new ShareDB({
  disableDocAction: true,
  disableSpaceDelimitedActions: true
});
const connection = backend.connect();

const duplicateLIs = (rz, lis) => {
  const mapping = {};
  Object.keys(lis).forEach(li => {
    const id = uuid();
    const doc = serverConnection.get('li', id);
    doc.create(lis[li]);
    mapping[li] = id;
  });

  const RZstring = JSON.stringify(rz);
  const newRZ = JSON.parse(
    Object.keys(mapping).reduce(
      (acc, mapp) => acc.replace(mapp, mapping[mapp]),
      RZstring
    )
  );
  return newRZ;
};

export const mergeOneInstance = async (
  grouping: string,
  activity: ActivityDbT,
  dataStructure: any,
  mergeFunction: ?Function,
  activityData: Object,
  structure: structureDefT,
  object: Object,
  providedInstanceActivityData?: any,
  docId?: string,
  sessionId: string
) => {
  let data;
  let newDataStructure = dataStructure;
  if (
    activity.template &&
    activity.template.duplicate &&
    activity.template.lis
  ) {
    newDataStructure = duplicateLIs(activity.template.rz, activity.template.lis);
  }
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
            Meteor.bindEnvironment(async () => {
              try {
                doc.create(
                  newDataStructure !== undefined
                    ? cloneDeep(newDataStructure)
                    : {}
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

              const meta: {
                createdInActivity: string,
                createdByInstance?: Object,
                sessionId: string
              } = {
                createdInActivity: activity._id,
                sessionId
              };
              const groupingKey = activity.groupingKey;
              if (groupingKey) {
                meta.createdByInstance = { [groupingKey]: grouping };
              }

              const dataFn = generateReactiveFn(
                doc,
                undefined,
                meta,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                serverConnection
              );
              // merging in config with incoming product
              if (mergeFunction) {
                await mergeFunction(
                  instanceActivityData,
                  dataFn,
                  doc.data,
                  activity
                );
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
    data = newDataStructure || {};
  }

  const serverDoc = serverConnection.get(
    'rz',
    docId || activity._id + '/' + grouping
  );
  try {
    serverDoc.create(data, undefined, undefined, _ => {
      // if (err) {
      //   console.error(
      //     Date.now(),
      //     'Creating ShareDB document',
      //     docId || [activity._id + '/' + grouping].join('/'),
      //     err
      //   );
      // }
    });
  } catch (e) {
    // console.error(
    //   Date.now(),
    //   'Catch: Creating ShareDB document for ',
    //   activity._id,
    //   grouping,
    //   e
    // );
  }
};

const mergeData = (
  activityId: string,
  object: ObjectT & GlobalStructureT,
  group?: string,
  sessionId: string
) => {
  const { activityData } = object;
  const activity = Activities.findOne(activityId);
  const activityType = activityTypesObj[activity.activityType];

  const { groups, structure } = doGetInstances(activity, object);
  const createGroups = group ? [group] : groups;

  const mergeFunction = activityType.mergeFunction;

  let initData =
    typeof activityType.dataStructure === 'function'
      ? activityType.dataStructure(activity.data)
      : activityType.dataStructure;

  if (activity.template && !activity.template.duplicate) {
    let newRZ;
    if (activity.templateRZCloned) {
      newRZ = activity.templateRZCloned;
    } else {
      newRZ = duplicateLIs(activity.template.rz, activity.template.lis);
      Activities.update(activityId, { $set: { templateRZCloned: newRZ } });
    }
    initData = newRZ;
  }

  const asyncCreates = createGroups.map(grouping =>
    mergeOneInstance(
      grouping,
      activity,
      initData,
      mergeFunction,
      activityData,
      structure,
      object,
      undefined,
      undefined,
      sessionId
    )
  );
  Promise.await(Promise.all(asyncCreates));

  // only create dashboard on initial merge, not when called by individuals joining late
  if (!group) {
    createDashboards(activity);
  }
};

export default mergeData;

export const ensureReactive = (sessionId: string, studentId: string) => {
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
    mergeData(ac._id, object, studentId, sessionId);
  });
};
