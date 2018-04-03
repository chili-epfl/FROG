// @flow

import { type activityDataT } from 'frog-utils';
import { Meteor } from 'meteor/meteor';

import { Graphs } from '../imports/api/graphs';
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
  const format = data => (formatProduct ? formatProduct(config, data) : data);
  return results.reduce(
    (acc, k) => ({
      ...acc,
      [cleanId(k.id)]: {
        data: format(k.data)
      }
    }),
    {}
  );
};

const getActivityDataFromReactive = (
  graphId: string,
  activityId: string
): activityDataT => {
  const activity = Graphs.findOne({ _id: graphId }).activities.find(
    x => x.id === activityId
  );
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

const ensure = (graphId: string, activityId: string) => {
  Products.update(
    activityId,
    {
      $set: {
        activityData: getActivityDataFromReactive(graphId, activityId),
        type: 'product'
      }
    },
    { upsert: true }
  );
  const acts = Graphs.findOne({ _id: graphId }).activities;
  const act = acts.find(x => x.id === activityId);
  act.state = 'computed';
  Graphs.update({ _id: graphId }, { $set: { activities: [...acts, act] } });
};

Meteor.methods({ 'reactive.to.product': (graphId, id) => ensure(graphId, id) });

export default ensure;
