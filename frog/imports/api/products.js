// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';
import Stringify from 'json-stable-stringify';

import { Logs } from './logs';

export const Products = new Mongo.Collection('products');

export const saveProduct = (activityId: string) => (
  (userId: string, data: Object) => 
    addNodeProduct(activityId, data, userId)
)


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

export const addNodeProduct = (nodeId: string, data: Object, userId: string) => {
  Products.insert({
    nodeId,
    userId,
    data,
    createdAt: new Date(),
    _id: uuid()
  });
};
