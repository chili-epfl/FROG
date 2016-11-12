import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils'
 
export const Activities = new Mongo.Collection('activities');

export const addActivity = (activity_type, data) =>
  Activities.insert({
    _id: uuid(), 
    activity_type: activity_type, 
    data: data, 
    created_at: new Date() })

export const flushActivities = () =>
  Meteor.call('activities.flush')

Meteor.methods({
  'activities.flush'() {

    Activities.remove({})
  }
})
