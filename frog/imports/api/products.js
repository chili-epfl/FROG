import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { uuid } from 'frog-utils'
import Stringify from 'json-stable-stringify'

import { Logs } from './logs'

export const Products = new Mongo.Collection('products')

export const addProduct = (activityId, activityType, userId, data, groupId) => {
  const merge = {
    activityId,
    activityType,
    userId,
    groupId
  }
  Logs.update(
    Stringify(merge),
    { $set: { ...merge, groupId, completed: true, updatedAt: Date() } },
    { upsert: true }
  )
  Products.insert({
    _id: uuid(),
    activityId,
    userId,
    data,
    groupId,
    username: Meteor.users.findOne({ _id: Meteor.userId() }).username,
    createdAt: new Date() })
}
