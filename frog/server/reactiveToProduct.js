// @flow

import { type activityDataT } from 'frog-utils';
import { Meteor } from 'meteor/meteor';

import { Activities } from '../imports/api/activities';
import { activityTypesObj } from '../imports/activityTypes';
import { Objects } from '../imports/api/objects';
import doGetInstances from '../imports/api/doGetInstances';
import { Products } from '../imports/api/products';
import { serverConnection } from './share-db-manager';

declare var Promise: any;

// given an activity ID, checks the dataStructure for a list of instances, fetches
// the reactive data for each instance, and compiles it into an activityDataT object

const cleanId = id => id.split('/')[1];

const formatResults = (results, formatProduct, config) => {
  const format = (data, instance) => {
    let product;
    try {
      product = formatProduct ? formatProduct(config, data, instance) : data;
    } catch (error) {
      console.error(error);
      product = data;
    }
    return product;
  };

  return results.reduce((acc, k) => {
    acc[cleanId(k.id)] = { data: format(k.data, cleanId(k.id)) };
    return acc;
  }, {});
};

export const getActivityDataFromReactive = (
  activityId: string
): activityDataT => {
  const activity = Activities.findOne(activityId);
  const aT = activityTypesObj[activity.activityType];
  const object = Objects.findOne(activityId);
  const { structure } = doGetInstances(activity, object);

  const promise = new Promise((resolve, reject) => {
    serverConnection.createFetchQuery(
      'rz',
      { _id: { $regex: '^' + activityId } },
      null,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(formatResults(results, aT.formatProduct, activity.data));
        }
      }
    );
  });

  const data = Promise.await(promise);

  const ret: activityDataT = { structure, payload: data };
  return ret;
};

const ensure = (activityId: string) => {
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
  Activities.update(activityId, { $set: { state: 'computed' } });
};

Meteor.methods({ 'reactive.to.product': id => ensure(id) });

export default ensure;
