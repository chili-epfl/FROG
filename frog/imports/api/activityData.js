// @flow

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const ActivityData = new Mongo.Collection('activity_data');

export const reactiveFn = (activityId: string) =>
  (groupId: string) => ({
    keySet: (k: string, v: Object) =>
      Meteor.call('reactive_data.key_set', activityId, groupId, k, v),
    keyDel: (k: string) =>
      Meteor.call('reactive_data.key_set', activityId, groupId, k),
    listAdd: (item: Object) =>
      Meteor.call('reactive_data.list_add', activityId, groupId, item),
    listAddNoClobber: (id: string, item: Object) =>
      Meteor.call(
        'reactive_data.list_add_no_clobber',
        activityId,
        groupId,
        id,
        item
      ),
    listSet: (id: string, item: Object) =>
      Meteor.call('reactive_data.list_set', activityId, groupId, id, item),
    listDel: (id: string) =>
      Meteor.call('reactive_data.list_del', activityId, groupId, id)
  });

Meteor.methods({
  'reactive_data.key_set': (activityId, groupId, k, v) => {
    ActivityData.update(
      { type: 'kv', activityId, groupId },
      { $set: { [k]: v } },
      { upsert: true }
    );
  },
  'reactive_data.list_add': (activityId, groupId, item) => {
    ActivityData.insert({
      type: 'list',
      activityId,
      groupId,
      value: item
    });
  },
  'reactive_data.list_set': (activityId, groupId, id, value) => {
    ActivityData.update(
      { _id: id, type: 'list', activityId, groupId },
      { $set: { value } }
    );
  },
  'reactive_data.list_add_no_clobber': (activityId, groupId, id, value) => {
    const idobj = { _id: id + activityId, type: 'list', activityId, groupId };

    if (!ActivityData.findOne(idobj)) {
      ActivityData.insert({
        type: 'list',
        activityId,
        groupId,
        _id: id + activityId,
        value
      });
    }
  }
});
