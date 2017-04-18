// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';
import Stringify from 'json-stable-stringify';

import { Logs } from './logs';

export const Products = new Mongo.Collection('products');

export const saveProduct = (activityId: string) =>
  (key: string, data: Object) => addNodeProduct(activityId, data, key);

export const addProduct = (
  activityId: string,
  activityType: string,
  userId: string,
  data: Object,
  groupId: string
) => {
  const merge = { activityId, activityType, userId, groupId };
  Logs.update(
    Stringify(merge),
    { $set: { ...merge, groupId, completed: true, updatedAt: Date() } },
    { upsert: true }
  );
  Products.insert({
    _id: uuid(),
    activityId,
    userId,
    data,
    groupId,
    username: Meteor.user().username,
    createdAt: new Date()
  });
};

export const addNodeProduct = (
  nodeId: string,
  data: Object,
  key: string
) => {
  Products.update(
    { _id: nodeId + key },
    { $set: { data, key, nodeId } },
    { upsert: true }
  );
};
