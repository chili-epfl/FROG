import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';

import { Activities, Operators, addSessionActivity, addSessionOperator } from './activities';
 
export const Sessions = new Mongo.Collection('sessions');

export const addSession = ( graphId ) => 
  Meteor.call('add.session', graphId)

export const updateSessionState = (id,state) => {
  Sessions.update({_id:id},{$set: {state:state}})
}

export const updateSessionActivity = (id,activity) => {
  Sessions.update({_id:id},{$set: {activity:activity}})
}

export const removeSession = (sessionId) => 
  Meteor.call('flush.session', sessionId)

Meteor.methods({
  'add.session'(graphId) {
    const sessionId = uuid()
    Sessions.insert({
      _id: sessionId,
      graphId: graphId,
      state: 'CREATED',
      activity: null
    })

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

  'flush.session'(sessionId) {
    Sessions.remove({ _id: sessionId })
    Activities.remove({ sessionId: sessionId })
    Operators.remove({ sessionId: sessionId })
  }
})
