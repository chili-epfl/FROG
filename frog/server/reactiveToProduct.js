// @flow

import {
  getAttributeValues,
  type activityDataT,
  type ObjectT
} from 'frog-utils';

import { Activities } from '../imports/api/activities';
import { Products } from '../imports/api/products';
import { Objects } from '../imports/api/objects';
import { getDoc } from './share-db-manager';

// given an activity ID, checks the dataStructure for a list of instances, fetches
// the reactive data for each instance, and compiles it into an activityDataT object

export const getActivityDataFromReactive = (
  activityId: string
): activityDataT => {
  const activity = Activities.findOne(activityId);
  const object: ObjectT = Objects.findOne(activityId);
  const { socialStructure, globalStructure: { studentIds } } = object;

  let groups;
  let structure;
  if (activity.plane === 1) {
    groups = studentIds;
    structure = 'individual';
  } else if (activity.plane === 2) {
    const key = activity.groupingKey;
    groups = getAttributeValues(socialStructure, key);
    structure = { groupingKey: key };
  } else {
    groups = ['all'];
    structure = 'all';
  }

  const data = groups.reduce(
    (acc, k) => ({
      ...acc,
      [k]: {
        data: getDoc(activity._id + '/' + k)
      }
    }),
    {}
  );

  const ret: activityDataT = { structure, payload: data };
  return ret;
};

export default (activityId: string) =>
  Products.update(
    activityId,
    {
      $set: {
        product: getActivityDataFromReactive(activityId),
        type: 'product'
      }
    },
    { upsert: true }
  );
