// @flow

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Presences } from 'meteor/tmeasday:presence';

import { uuid } from 'frog-utils';

import { Activities, Operators, Connections } from './activities';
import { addGraph } from './graphs'

export const Sessions = new Mongo.Collection('sessions');

export const setTeacherSession = (sessionId: string) => {
  Meteor.users.update(
    { _id: Meteor.userId() },
    { $set: { 'profile.controlSession': sessionId } }
  );
};

export const setStudentSession = (sessionId: string) => {
  Meteor.users.update(
    { _id: Meteor.userId() },
    { $set: { 'profile.currentSession': sessionId } }
  );
};

const addSessionItem = (type, sessionId, copyGraphId, params) => {
  const id = uuid();
  const collections = {
    activities: Activities,
    operators: Operators,
    connections: Connections
  };
  collections[type].insert({
    ...params,
    sessionId,
    createdAt: new Date(),
    graphId: copyGraphId,
    _id: id
  });
  return id;
};

export const addSession = (graphId: string) => {
  Meteor.call('add.session', graphId);
};

export const updateSessionState = (id: string, state: string) => {
  Sessions.update(id, { $set: { state } });
  if (state === 'STARTED') {
    Sessions.update(id, { $set: { startedAt: new Date().getTime() } });
  }
  if (state === 'PAUSED') {
    Sessions.update(id, { $set: { pausedAt: new Date().getTime() } });
  }
};

export const updateOpenActivities = (
  sessionId: string,
  openActivities: Array<string>,
  timeInGraph: number
) => {
  Sessions.update(
    { _id: sessionId },
    { $set: { openActivities, timeInGraph, startedAt: new Date().getTime() } }
  );
  openActivities.forEach(activityId => {
    Meteor.call('run.dataflow', 'activity', activityId, sessionId);
  });
};

export const removeSession = (sessionId: string) =>
  Meteor.call('flush.session', sessionId);

export const joinAllStudents = (sessionId: string) =>
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
    const copyGraphId = addGraph('SESSION_GRAPH<' + sessionId + '>')

    Sessions.insert({
      _id: sessionId,
      graphId,
      copyGraphId,
      state: 'CREATED',
      timeInGraph: -1,
      startedAt: null,
      pausedAt: null
    });

    const matching = {};
    const activities = Activities.find({ graphId }).fetch();
    activities.forEach(activity => {
      matching[activity._id] = addSessionItem(
        'activities',
        sessionId,
        copyGraphId,
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
