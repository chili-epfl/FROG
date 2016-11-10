import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils'
 
export const Activities = new Mongo.Collection('activities');
export const Operators = new Mongo.Collection('operators');

export const addActivity = (activity_type, data, id) => {
  if(id) { 
    Activities.update(id, {$set: {data: data}})
  } else {
    Activities.insert({
      _id: uuid(), 
      activity_type: activity_type, 
      data: data, 
      created_at: new Date() })
  }
} 

export const addOperator = (operator_type, data, id) => {
  if(id) { 
    Operators.update(id, {$set: {data: data}})
  } else {
    Operators.insert({
      _id: uuid(), 
      operator_type: operator_type, 
      data: data, 
      created_at: new Date() })
  }
} 

export const flushActivities = () =>
  Meteor.call('activities.flush')

Meteor.methods({
  'activities.flush'() {

    Activities.remove({})
  }
})
