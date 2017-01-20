import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { uuid } from 'frog-utils'

import { Activities, Operators, addSessionActivity, addSessionOperator } from './activities'

export const Sessions = new Mongo.Collection('sessions');

export const addSession = (graphId) =>
  Meteor.call('add.session', graphId)

export const importSession = ( params ) => 
  Meteor.call('import.session', params)

export const updateSessionState = (id, state) => {
  Sessions.update({ _id: id }, { $set: { state } })
  if (state === 'STARTED') {
    if (Sessions.findOne({ _id: id }).pausedAt != null) {
      const session = Sessions.findOne({ _id: id })
      const newStartedAt = session.startedAt + (new Date().getTime() - session.pausedAt)
      Sessions.update({ _id: id }, { $set: { startedAt: newStartedAt } })
    }
    Sessions.update({ _id: id }, { $set: { pausedAt: null } })
  }
  if (state === 'PAUSED') {
    if (Sessions.findOne({ _id: id }).pausedAt == null) {
      Sessions.update({ _id: id }, { $set: { pausedAt: new Date().getTime() } })
    }
  }
}

export const updateSessionActivity = (id, activity) => {
  Sessions.update({ _id: id }, { $set: { activity, startedAt: new Date().getTime() } })
}

export const removeSession = (sessionId) =>
  Meteor.call('flush.session', sessionId)

Meteor.methods({
  'add.session': (graphId) => {
    const sessionId = uuid()
    Sessions.insert({
      _id: sessionId,
      graphId,
      state: 'CREATED',
      activity: null,
      startedAt: null,
      pausedAt: null
    })

    const matching = {}
    const activities = Activities.find({ graphId }).fetch()
    activities.forEach((activity) => {
      matching[activity._id] = addSessionActivity({
        data: activity.data,
        activityType: activity.activityType,
        sessionId
      })
    })

    const operators = Operators.find({ graphId }).fetch()
    operators.forEach((operator) => {
      addSessionOperator({
        data: operator.data,
        from: matching[operator.from],
        to: matching[operator.to],
        type: operator.type,
        operatorType: operator.operatorType,
        sessionId
      })
    })
  },
  
  'import.session'(params) {
    const graphId = params.graphId
    const sessionId = params._id
    Sessions.insert({...params, _id: sessionId })

    const matching = {}
    const activities = Activities.find({ graphId: graphId }).fetch()
    activities.forEach(activity => {
      matching[activity._id] = addSessionActivity({ 
        data: activity.data, 
        activity_type: activity.activity_type,
        sessionId: sessionId 
      })
    })

    const operators = Operators.find({ graphId: graphId }).fetch()
    operators.forEach(operator => {
      addSessionOperator({ 
        data: operator.data, 
        from: matching[operator.from],
        to: matching[operator.to], 
        operator_type: operator.operator_type,
        sessionId: sessionId
      })
    })
  },

  'flush.session': (sessionId) => {
    Sessions.remove({ _id: sessionId })
    Activities.remove({ sessionId })
    Operators.remove({ sessionId })
  }
})
