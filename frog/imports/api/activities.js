import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils'
import { operator_types_obj } from '../operator_types'
 
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
      status: 'OUT'
    })
  }
} 

export const duplicateActivity = (activity) =>
  Activities.insert({...activity, _id: uuid(), data: {...activity.data, name: activity.data.name + ' (copy)'}})

export const addGraphActivity = (params) => {
  const id = uuid()
  Activities.insert({...params, created_at: new Date(), _id:id, status: 'IN'})
  return(id)
}

export const addGraphOperator = (params) => {
  const id = uuid()
  Operators.insert({...params, created_at: new Date(), _id:id, status: 'IN'})
  return(id)
}

export const copyActivityIntoGraphActivity = (graphActivityId, fromActivityId) => {
  const data = Activities.findOne({_id:fromActivityId}).data
  Activities.update(graphActivityId, {$set: {data: data}})
}

export const copyOperatorIntoGraphOperator = (graphOperatorId, fromOperatorId) => {
  const data = Operators.findOne({_id:fromOperatorId}).data
  Operators.update(graphOperatorId, {$set: {data: data}})
}

export const deleteGraphActivities = ( graphId ) => {
  Meteor.call('graphActivities.flush',graphId)
}

export const dragGraphActivity = ( id, newPosition) => {
  console.log('dragGraphActivity')
  Activities.update(id, {$set: {xPosition: newPosition}})
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
      status: 'OUT',
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
  'graphActivities.flush'(graphId){
    console.log('graphActivities.flush')
    console.log(graphId)
    Activities.remove({graphId:graphId})
  }
})
