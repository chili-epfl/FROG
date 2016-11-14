import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils'
import { Logs } from './logs'
import Stringify from 'json-stable-stringify'
 
export const Products = new Mongo.Collection('products');

export const addProduct = (activity_id, activity_type, user_id, data, group) => {
  const merge = {
    activity: activity_id, 
    activity_type: activity_type,
    user: user_id,
    group: group
  }
  Logs.update(Stringify(merge), {$set: {...merge, group: group, completed: true, updated_at: Date()}}, {upsert: true})
  Products.insert({
    _id: uuid(), 
    activity_id: activity_id, 
    user_id: user_id,
    data: data, 
    group_id: group,
    username: Meteor.users.findOne({_id: Meteor.userId()}).username,
    created_at: new Date() })
}

