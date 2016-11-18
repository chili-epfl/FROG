import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils'
 
export const ActivityData = new Mongo.Collection('activity_data');

export const activityDataSetter = (session_id, activity_id, group_id) =>
  Activities.insert({
    _id: uuid(), 
    session_id: activity_type, 
    activity_id: data, 
    group_id: data, 
    created_at: new Date() })

export const reactiveFn = (session_id, activity_id, group_id) => ({
  keySet: (k, v) => Meteor.call('reactive_data.key_set', session_id, activity_id, group_id, k, v),
  keyDel: (k) => Meteor.call('reactive_data.key_set', session_id, activity_id, group_id, k),

  listAdd: (item) => Meteor.call('reactive_data.list_add', session_id, activity_id, group_id, item),
  listSet: (id, item) => Meteor.call('reactive_data.list_set', session_id, activity_id, group_id, id, item),
  listDel: (id) => Meteor.call('reactive_data.list_del', session_id, activity_id, group_id, d)
})

Meteor.methods({
  'reactive_data.key_set'(session_id, activity_id, group_id, k, v) {
    console.log('keyset', k, v)
    ActivityData.update({type: 'kv', session_id: session_id, activity_id: activity_id, group_id: group_id}, {$set: {[k]: v}}, {upsert: true})
  },

  'reactive_data.list_add'(session_id, activity_id, group_id, item) {
    ActivityData.insert({type: 'list', session_id: session_id, activity_id: activity_id, group_id: group_id, value: item})
  },

  'reactive_data.list_set'(session_id, activity_id, group_id, id, val) {
    ActivityData.update({_id: id, type: 'list', session_id: session_id, activity_id: activity_id, group_id: group_id},{$set: {value: val}})
  }
})

