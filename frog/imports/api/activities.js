import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';
import { clone } from 'lodash'
import { Graphs, addGraph } from './graphs';

import { operatorTypesObj } from '../operatorTypes'

export const Activities = new Mongo.Collection('activities')
export const Operators = new Mongo.Collection('operators')
export const Results = new Mongo.Collection('results')


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
  Activities.insert({ ...params, graphId: params.graphId, createdAt: new Date(), _id: id })

export const addSessionActivity = (params) => {
  const id = uuid()
  Activities.insert({ ...params, sessionId: params.sessionId, createdAt: new Date(), _id: id })
  return id
}

export const updateGraphActivityDuration = (activityId, duration) => {
  Activities.update({ _id: activityId }, { $set: { 'data.duration': duration } })
}

export const removeGraphActivity = (activityId) =>
  Meteor.call('graph.flush.activity', activityId)

export const addGraphOperator = (params, id = uuid()) =>
  Operators.insert({ ...params, graphId: params.graphId, createdAt: new Date(), _id: id })



export const modifyGraphOperator = (id, operatorType, type, data) =>
  Operators.update(id, { $set: { operatorType, type, data } })

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

export const dragGraphActivitySet = (id, position) => {
  Activities.update(id, { $set: { position } })
}
export const dragGraphActivity = (id, xPosition) => {
  Activities.update(id, { $inc: { xPosition } })
}

export const removeGraphOperator = (operatorId) => {
  Meteor.call('graph.flush.operator', operatorId)
}

export const removeGraphOperatorsLinkedToActivity = (activityId) => {
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
  const activities = Activities.find({graphId}).fetch()
  const oldActivitiesId = activities.map((activity) => activity._id)
  const newActivitiesId = oldActivitiesId.map(() => uuid())
  const operators = Operators.find({graphId}).fetch()
  const graph = Graphs.findOne({ _id: graphId })
  const newGraphId = addGraph(graph.name + ' (copy)')

  operators.forEach((operator) => {
    const fromIndex = oldActivitiesId.indexOf(operator.from._id)
    const toIndex = oldActivitiesId.indexOf(operator.to._id)
    const fromObject = { plane: activities[fromIndex].plane, _id: newActivitiesId[fromIndex] }
    const toObject = { plane: activities[toIndex].plane, _id: newActivitiesId[toIndex] }
    const opId = uuid()
    addGraphOperator({ graphId: newGraphId, from: fromObject, to: toObject }, opId)
    if (operator.operatorType) {
      modifyGraphOperator(opId, operator.operatorType, operator.type, operator.data)
    }
  })

  activities.forEach((activity, i) => {
    const newActivity = clone(activity, true)
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

  'graph.flush.operator': (operatorId) => {
    Operators.remove({ _id: operatorId })
  },

  'graph.flush.operators': (activityId) => {
    Operators.remove({ 'from._id': activityId })
    Operators.remove({ 'to._id': activityId })
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
