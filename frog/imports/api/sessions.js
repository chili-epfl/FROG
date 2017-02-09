import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';

import { Activities, Operators, Connections } from './activities';

export const Sessions = new Mongo.Collection('sessions');

const addSessionItem = (type, sessionId, params) => {
  const id = uuid();
  const types = {
    activities: Activities,
    operators: Operators,
    connections: Connections
  };
  types[type].insert({
    ...params,
    sessionId,
    createdAt: new Date(),
    graphId: null,
    _id: id
  });
  return id;
};

export const addSession = graphId => Meteor.call('add.session', graphId);

export const updateSessionState = (id, state) => {
  Sessions.update({ _id: id }, { $set: { state } });
  if (state === 'STARTED') {
    if (Sessions.findOne({ _id: id }).pausedAt != null) {
      const session = Sessions.findOne({ _id: id });
      const newStartedAt = session.startedAt +
        (new Date().getTime() - session.pausedAt);
      Sessions.update({ _id: id }, { $set: { startedAt: newStartedAt } });
    }
    Sessions.update({ _id: id }, { $set: { pausedAt: null } });
  }
  if (state === 'PAUSED') {
    if (Sessions.findOne({ _id: id }).pausedAt == null) {
      Sessions.update({ _id: id }, {
        $set: { pausedAt: new Date().getTime() }
      });
    }
  }
};

export const updateSessionActivity = (id, activity) => {
  Sessions.update({ _id: id }, {
    $set: { activity, startedAt: new Date().getTime() }
  });
};

export const removeSession = sessionId =>
  Meteor.call('flush.session', sessionId);

Meteor.methods({
  'add.session': graphId => {
    const sessionId = uuid();
    Sessions.insert({
      _id: sessionId,
      graphId,
      state: 'CREATED',
      activity: null,
      startedAt: null,
      pausedAt: null
    });

    const matching = {};
    const activities = Activities.find({ graphId }).fetch();
    activities.forEach(activity => {
      matching[activity._id] = addSessionItem(
        'activities',
        sessionId,
        activity
      );
    });

    const operators = Operators.find({ graphId }).fetch();
    operators.forEach(operator => {
      matching[operator._id] = addSessionItem('operators', sessionId, operator);
    });

    const connections = Connections.find({ graphId }).fetch();
    connections.forEach(connection => {
      addSessionItem('connections', sessionId, {
        source: {
          id: matching[connection.source.id],
          type: connection.source.type
        },
        target: {
          id: matching[connection.target.id],
          type: connection.target.type
        }
      });
    });
  },
  'flush.session': sessionId => {
    Sessions.remove({ _id: sessionId });
    Activities.remove({ sessionId });
    Operators.remove({ sessionId });
    Connections.remove({ sessionId });
  }
});
