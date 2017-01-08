import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';
import { Graphs, addGraph } from './graphs';

import { operatorTypesObj } from '../operatorTypes'
import { Graphs } from './graphs'

export const Activities = new Mongo.Collection('activities')
export const Operators = new Mongo.Collection('operators')
export const Results = new Mongo.Collection('results');


export const addActivity = (activityType, data, id) => {
  if (id) {
    Activities.update(id, { $set: { data } })
  } else {
    Activities.insert({ _id: uuid(), activityType, data, createdAt: new Date() })
  }
}

export const duplicateActivity = (activity) =>
  Activities.insert({ ...activity, _id: uuid(), data: { ...activity.data, name: activity.data.name + ' (copy)' } })

export const addGraphActivity = (params, id = uuid()) =>
  Activities.insert({ ...params, graphId: params.graphId, createdAt: new Date(), _id: id})

export const addSessionActivity = (params) => {
  const id = uuid()
  Activities.insert({ ...params, sessionId: params.sessionId, createdAt: new Date(), _id: id })
  return id
}

export const updateGraphActivityDuration = (activityId, duration) => {
  Activities.update({_id: activityId}, {$set: {"data.duration": duration}})
}

export const removeGraphActivity = (activityId) =>
  Meteor.call('graph.flush.activity', activityId)

export const addGraphOperator = (params) =>
  Operators.insert({ ...params, graphId: params.graphId, createdAt: new Date(), _id: uuid() })


export const modifyGraphOperator = (operatorId, opType, type, data) =>
  Operators.update(operatorId, {$set: {operator_type: opType, type: type, data: data}})

export const addSessionOperator = (params) =>
  Operators.insert({ ...params, sessionId: params.sessionId, createdAt: new Date(), _id: uuid() })

export const copyActivityIntoGraphActivity = (graphActivityId, fromActivityId) => {
  const fromActivity = Activities.findOne({ _id: fromActivityId })
  Activities.update(
    graphActivityId,
    { $set: {
      data: fromActivity.data,
      activityType: fromActivity.activityType,
      parentId: fromActivityId
    } }
  )
}

export const copyOperatorIntoGraphOperator = (graphOperatorId, fromOperatorId) => {
  const fromOperator = Operators.findOne({ _id: fromOperatorId })
  Operators.update(
    graphOperatorId,
    { $set: {
      data: fromOperator.data,
      operatorType: fromOperator.operatorType,
      type: fromOperator.type
    } }
  )
}

export const removeGraph = (graphId) =>
  Meteor.call('graph.flush.all', graphId)

export const dragGraphActivitySet = ( id, position ) => {
  Activities.update({_id: id}, {$set: {position: position}})
}
export const dragGraphActivity = (id, xPosition) => {
  Activities.update(id, { $inc: { xPosition } })
}

export const removeGraphOperator = (activityId) => {
  Meteor.call('graph.flush.operators', activityId)
}

export const addOperator = (operatorType, data, id) => {
  if (id) {
    Operators.update(id, { $set: { data } })
  } else {
    Operators.insert({
      _id: uuid(),
      operatorType,
      type: operatorTypesObj[operatorType].meta.type,
      data,
      createdAt: new Date()
    })
  }
}

export const addResult = (type, activityId, result) => {
  Results.update(
    { _id: activityId + type },
    { $set: { type, activityId, result, createdAt: new Date() } },
    { upsert: true }
  )
}

export const duplicateGraph = (graphId) => {
  let activities = Activities.find({graphId: graphId}).fetch()
  let oldActivitiesId = activities.map((activity) => activity._id)
  const newActivitiesId = oldActivitiesId.map((id) => uuid())
  let operators = Operators.find({graphId: graphId}).fetch()
  let graph = Graphs.findOne({_id: graphId})
  let newGraphId = addGraph(graph.name + ' (copy)')

  operators.forEach((operator) => {
    let fromIndex = oldActivitiesId.indexOf(operator.from._id)
    let toIndex = oldActivitiesId.indexOf(operator.to._id)
    const fromObject = {plane: activities[fromIndex].plane, _id: newActivitiesId[fromIndex]}
    const toObject = {plane: activities[toIndex].plane, _id:newActivitiesId[toIndex]}
    addGraphOperator({_id: uuid(), graphId: newGraphId, from: fromObject, to: toObject})
  })

  activities.forEach((activity, i) => {
    let newActivity = _.clone(activity, true)
    newActivity._id = newActivitiesId[i]
    newActivity.graphId = newGraphId
    addGraphActivity(newActivity, newActivity._id)
  })
  return newGraphId
}




export const flushActivities = () =>
  Meteor.call('activities.flush')

Meteor.methods({
  'activities.flush': () => {
    Activities.remove({})
  },

  'graph.flush.operators'(activityId) {
    Operators.remove({"from._id": activityId})
    Operators.remove({"to._id": activityId})
  },

  'graph.flush.all': (graphId) => {
    Graphs.remove({ _id: graphId })
    Activities.remove({ graphId })
    Operators.remove({ graphId })
  },

  'graph.flush.activity': (activityId) => {
    Operators.remove({ from: activityId })
    Operators.remove({ to: activityId })
    Activities.remove({ _id: activityId })
  }
})
