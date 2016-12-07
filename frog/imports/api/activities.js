import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';
import { operator_types_obj } from '../operator_types';
import { Graphs } from './graphs';

export const Activities = new Mongo.Collection('activities');
export const Operators = new Mongo.Collection('operators');
export const Results = new Mongo.Collection('results');

export const addActivity = (activity_type, data, id) => {
  if(id) { 
    Activities.update(id, {$set: {data: data}})
  } else {
    Activities.insert({
      _id: uuid(), 
      activity_type: activity_type, 
      data: data, 
      created_at: new Date(),
    })
  }
} 

export const duplicateActivity = (activity) =>
  Activities.insert({...activity, _id: uuid(), data: {...activity.data, name: activity.data.name + ' (copy)'}})

export const addGraphActivity = (params) => {
  const id = uuid()
  Activities.insert({ ...params, created_at: new Date(), _id: id })
  return(id)
}

export const removeGraphActivity = (activityId) => 
  Meteor.call('graph.flush.activity', activityId)

export const addGraphOperator = (params) => {
  const id = uuid()
  Operators.insert({...params, created_at: new Date(), _id:id })
  return(id)
}

export const copyActivityIntoGraphActivity = (graphActivityId, fromActivityId) => {
  const fromActivity = Activities.findOne({_id:fromActivityId})
  Activities.update(graphActivityId, {$set: {data: fromActivity.data, activity_type: fromActivity.activity_type, parent_id: fromActivityId}})
}

export const copyOperatorIntoGraphOperator = (graphOperatorId, fromOperatorId) => {
  const fromOperator = Operators.findOne({_id:fromOperatorId})
  Operators.update(graphOperatorId, {$set: {data: fromOperator.data, operator_type: fromOperator.operator_type, type:fromOperator.type}})
}

export const removeGraph = ( graphId ) => 
  Meteor.call('graph.flush.all', graphId)

export const dragGraphActivity = ( id, xPosition ) => {
  Activities.update(id, {$inc: {xPosition: xPosition}})
}

export const addOperator = (operator_type, data, id) => {
  if(id) { 
    Operators.update(id, {$set: {data: data}})
  } else {
    Operators.insert({
      _id: uuid(), 
      operator_type: operator_type, 
      type: operator_types_obj[operator_type].meta.type,
      data: data, 
      created_at: new Date() })
  }
} 

export const addResult = (type, activity_id, result) => {
  Results.update(activity_id + ":" + type, {$set: {type: type, activity_id: activity_id, result: result, created_at: new Date()}}, {upsert: true})
} 

export const flushActivities = () =>
  Meteor.call('activities.flush')

Meteor.methods({
  'activities.flush'() {
    Activities.remove({})
  },

  'graph.flush.all'(graphId){
    Graphs.remove({ _id: graphId })
    Activities.remove({ graphId: graphId })
    Operators.remove({ graphId: graphId })
  },

  'graph.flush.activity'(activityId){
    Operators.remove({ from: activityId })
    Operators.remove({ to: activityId })
    Activities.remove({ _id: activityId })
  }
})
