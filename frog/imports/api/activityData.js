import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const ActivityData = new Mongo.Collection('activity_data')

export const reactiveFn = (sessionId, activityId, groupId) => ({
  keySet: (k, v) => Meteor.call('reactive_data.key_set', sessionId, activityId, groupId, k, v),
  keyDel: (k) => Meteor.call('reactive_data.key_set', sessionId, activityId, groupId, k),

  listAdd: (item) => Meteor.call('reactive_data.list_add', sessionId, activityId, groupId, item),
  listAddNoClobber: (id, item) => Meteor.call('reactive_data.list_add_no_clobber', sessionId, activityId, groupId, id, item),
  listSet: (id, item) => Meteor.call('reactive_data.list_set', sessionId, activityId, groupId, id, item),
  listDel: (id) => Meteor.call('reactive_data.list_del', sessionId, activityId, groupId, id)
})

Meteor.methods({
  'reactive_data.key_set': (sessionId, activityId, groupId, k, v) => {
    ActivityData.update({ type: 'kv', sessionId, activityId, groupId }, { $set: { [k]: v } }, { upsert: true })
  },

  'reactive_data.list_add': (sessionId, activityId, groupId, item) => {
    ActivityData.insert({ type: 'list', sessionId, activityId, groupId, value: item })
  },

  'reactive_data.list_set': (sessionId, activityId, groupId, id, value) => {
    ActivityData.update({ _id: id, type: 'list', sessionId, activityId, groupId }, { $set: { value } })
  },

  'reactive_data.list_add_no_clobber': (sessionId, activityId, groupId, id, value) => {
    const idobj = { _id: id, type: 'list', sessionId, activityId, groupId }

    if (!ActivityData.findOne(idobj)) {
      ActivityData.insert({ type: 'list', sessionId, activityId, groupId, _id: id, value })
    }
  }
})
