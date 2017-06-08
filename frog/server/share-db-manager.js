import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';
import ShareDBMongo from 'sharedb-mongo';
import http from 'http';
import { Meteor } from 'meteor/meteor';
import { merge } from 'lodash';
import { promisedProperties } from 'frog-utils';

import generateReactiveFn from '../imports/api/generateReactiveFn';
import { engineLogger } from '../imports/api/logs';
import { Activities } from '../imports/api/activities';
import { Products } from '../imports/api/products';
import { Objects } from '../imports/api/objects';
import { activityTypesObj } from '../imports/activityTypes';
const log = (...e) => engineLogger(null, e);

const db = ShareDBMongo('mongodb://localhost:3001/sharedb');
const server = http.createServer();
const backend = new ShareDB({ db });
export const serverConnection = backend.connect();
const globalState = {};

export const startShareDB = () => {
  new WebSocket.Server({ server }).on('connection', ws => {
    backend.listen(new WebsocketJSONStream(ws));
  });

  server.listen(3002, err => {
    if (err) throw err;
  });
};

export const doOps = (collection, ops) => {
  const doc = serverConnection.get('rz', docId);
  doc.fetch();
  doc.on('ready', () => ops.map(op => doc.submitOp(op)));
};

export const mergeData = (activityId, object) => {
  const { socialStructure, globalStructure, product } = object;
  const activity = Activities.findOne(activityId);

  let groups;
  if (activity.grouping && socialStructure[activity.grouping]) {
    groups = Object.keys(socialStructure[activity.grouping]);
  } else {
    groups = ['all'];
  }
  groups.forEach(grouping => {
    if (
      (activity.hasMergedData && activity.hasMergedData[grouping]) ||
      (globalState[activityId] && globalState[activityId][grouping])
    ) {
      return;
    }
    globalState[activityId] = { ...globalState[activityId], [grouping]: true };
    // the reason for using globalState is that without transactions, just checking the database
    // would sometimes lead to the same thing being done twice. this is still not fool-proof,
    // probably the safest would be for all actions to be triggered by the engine, not by
    // browsers.
    Activities.update(activityId, {
      $set: {
        hasMergedData: { ...(activity.hasMergedData || {}), [grouping]: true }
      }
    });
    const activityType = activityTypesObj[activity.activityType];
    const mergeFunction = activityType.mergeFunction;
    const doc = serverConnection.get('rz', activityId + '/' + grouping);
    doc.fetch();
    doc.on(
      'load',
      Meteor.bindEnvironment(() => {
        if (!doc.type) {
          doc.create(activityType.dataStructure || {});
        }
        if (mergeFunction) {
          const dataFn = generateReactiveFn(doc);
          // merging in config with incoming product
          let prod;
          if (!object.products) {
            prod = null;
          } else if (object.products.all) {
            prod = object.products.all;
          } else if (object.products[grouping]) {
            prod = object.products[grouping];
          } else {
            console.error('No product matching grouping');
          }
          const newObject = {
            globalStructure,
            socialStructure,
            products: merge(prod)
          };
          log('newObject', newObject);
          mergeFunction(newObject, dataFn);
        }
      })
    );
  });
};

const getDoc = docId =>
  new Promise((resolve, reject) => {
    const doc = serverConnection.get('rz', docId);
    doc.fetch();
    doc.on('load', () => resolve(doc));
    doc.on('error', error => reject(error));
  });

const readDoc = doc => doc.data;

export const getProducts = activityId => {
  const activity = Activities.findOne(activityId);
  const object = Objects.findOne(activityId);
  const { data: { socialStructure } } = object;
  let groups;
  if (activity.grouping && socialStructure[activity.grouping]) {
    groups = Object.keys(socialStructure[activity.grouping]);
  } else {
    groups = ['all'];
  }
  groupPromises = groups.reduce(
    (acc, k) => ({ ...acc, [k]: getDoc(activity._id + '/' + k).then(readDoc) }),
    {}
  );
  return promisedProperties(groupPromises)
    .then(prod => {
      Products.update(
        activityId,
        { $set: { data: prod, type: 'product' } },
        { upsert: true }
      );
      Promise.resolve(prod);
    })
    .catch(e => Promise.reject(e));
};
