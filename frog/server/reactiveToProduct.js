// @flow

import { type activityDataT } from 'frog-utils';

import { Activities } from '../imports/api/activities';
import { Objects } from '../imports/api/objects';
import doGetInstances from '../imports/api/doGetInstances';
import { Products } from '../imports/api/products';
import { serverConnection } from './share-db-manager';

declare var Promise: any;

// given an activity ID, checks the dataStructure for a list of instances, fetches
// the reactive data for each instance, and compiles it into an activityDataT object

const cleanId = id => id.split('/')[1];

const formatResults = results =>
  results.reduce(
    (acc, k) => ({
      ...acc,
      [cleanId(k.id)]: {
        data: k.data
      }
    }),
    {}
  );

export const getActivityDataFromReactive = (
  activityId: string
): activityDataT => {
  const activity = Activities.findOne(activityId);
  const object = Objects.findOne(activityId);
  const { structure } = doGetInstances(activity, object);

  const promise = new Promise((resolve, reject) => {
    const t0 = Date.now();
    serverConnection.createFetchQuery(
      'rz',
      { _id: { $regex: '^' + activityId } },
      null,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log('fetched elapsed', Date.now() - t0);
          resolve(formatResults(results));
        }
      }
    );
  });

  const data = Promise.await(promise);

  const ret: activityDataT = { structure, payload: data };
  return ret;
};

export default (activityId: string) => {
  const t0 = Date.now();
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
  console.log('reactive to prod elapsed', Date.now() - t0);
};
