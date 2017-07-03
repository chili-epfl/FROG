// @flow

import { type activityDataT } from 'frog-utils';

import { Activities } from '../imports/api/activities';
import { Objects } from '../imports/api/objects';
import doGetInstances from '../imports/api/doGetInstances';
import { Products } from '../imports/api/products';
import { getDoc } from './share-db-manager';

// given an activity ID, checks the dataStructure for a list of instances, fetches
// the reactive data for each instance, and compiles it into an activityDataT object

export const getActivityDataFromReactive = (
  activityId: string
): activityDataT => {
  const activity = Activities.findOne(activityId);
  const object = Objects.findOne(activityId);
  const { groups, structure } = doGetInstances(activity, object);

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
        activityData: getActivityDataFromReactive(activityId),
        type: 'product'
      }
    },
    { upsert: true }
  );
