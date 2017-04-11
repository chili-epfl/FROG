import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';

import { Activities, Operators, Connections } from './activities';

export const Sessions = new Mongo.Collection('sessions');

export const setTeacherSession = sessionId => {
  Meteor.users.update(
    { _id: Meteor.userId() },
    { $set: { 'profile.controlSession': sessionId } }
  );
};

export const setStudentSession = sessionId => {
  Meteor.users.update(
    { _id: Meteor.userId() },
    { $set: { 'profile.currentSession': sessionId } }
  );
};

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

export const addSession = graphId => {
  Meteor.call('add.session', graphId);
};

export const updateSessionState = (id, state) => {
  Sessions.update(id, { $set: { state } });
  if (state === 'STARTED') {
    Sessions.update(id, { $set: { startedAt: new Date().getTime() } });
  }
  if (state === 'PAUSED') {
    if (Sessions.findOne(id).pausedAt == null) {
      Sessions.update(
        { _id: id },
        { $set: { pausedAt: new Date().getTime() } }
      );
    }
  }
};

export const updateSessionActivity = (sessionId, activityId) => {
  Sessions.update(
    { _id: sessionId },
    { $set: { activityId, startedAt: new Date().getTime() } }
  );
  Meteor.call('run.dataflow', 'activity', activityId, sessionId);
};

export const removeSession = sessionId =>
  Meteor.call('flush.session', sessionId);

export const joinAllStudents = sessionId =>
  Meteor.call('session.joinall', sessionId);

Meteor.methods({
  'session.joinall': sessionId => {
    Presences.find({ userId: { $exists: true } }).fetch().forEach(x => {
      Meteor.users.update(
        { _id: x.userId },
        { $set: { 'profile.currentSession': sessionId } }
      );
    });
  },
  'add.session': graphId => {
    const sessionId = uuid();
    Sessions.insert({
      _id: sessionId,
      graphId,
      state: 'CREATED',
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
    setTeacherSession(sessionId);
  },
  'flush.session': sessionId => {
    Sessions.remove(sessionId);
    Activities.remove({ sessionId });
    Operators.remove({ sessionId });
    Connections.remove({ sessionId });
  }
});
