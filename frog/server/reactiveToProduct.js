// @flow

import {
  getAttributeValues,
  type activityDataT,
  type ObjectT
} from 'frog-utils';

import { Activities, getInstances } from '../imports/api/activities';
import { Products } from '../imports/api/products';
import { Objects } from '../imports/api/objects';
import { getDoc } from './share-db-manager';

// given an activity ID, checks the dataStructure for a list of instances, fetches
// the reactive data for each instance, and compiles it into an activityDataT object

export const getActivityDataFromReactive = (
  activityId: string
): activityDataT => {
  const [groups, structure] = getInstances(activityId);

  const data = groups.reduce(
    (acc, k) => ({
      ...acc,
      [k]: {
        data: getDoc(activityId + '/' + k)
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
