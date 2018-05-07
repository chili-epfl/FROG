// @flow

import { type activityDataT, type ActivityPackageT } from 'frog-utils';
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

const formatResults = (results, formatProduct, config, initData) => {
  const format = (data, instance) => {
    let product;
    if (formatProduct) {
      try {
        product = formatProduct(config, data, instance);
      } catch (error) {
        console.error(
          'Err: Failed to run formatProduct with reactive data',
          error
        );
        console.error(error);
        try {
          product = formatProduct(config, initData, instance);
        } catch (err) {
          console.error(
            'Err: Failed to run formatProduct with initialData',
            error
          );
          product = {};
        }
      }
    } else {
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
  const aT: ActivityPackageT = activityTypesObj[activity.activityType];
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
          resolve(
            formatResults(
              results,
              aT.formatProduct,
              activity.data,
              aT.dataStructure
            )
          );
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
