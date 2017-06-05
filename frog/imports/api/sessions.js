// @flow

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Presences } from 'meteor/tmeasday:presence';

import { uuid } from 'frog-utils';

import { Activities, Operators, Connections } from './activities';
import { Graphs, addGraph } from './graphs';
import runDataflow from './runDataflow';

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

const addSessionItem = (type, graphId, params) => {
  const id = uuid();
  const collections = {
    activities: Activities,
    operators: Operators,
    connections: Connections
  };
  collections[type].insert({
    ...params,
    createdAt: new Date(),
    graphId,
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
  if (Meteor.isServer) {
    openActivities.forEach(activityId => {
      runDataflow('activity', activityId, sessionId);
    });
  }
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
    const copyGraphId = addGraph('SESSION_GRAPH<' + sessionId + '>');

    Sessions.insert({
      _id: sessionId,
      fromGraphId: graphId,
      graphId: copyGraphId,
      state: 'CREATED',
      timeInGraph: -1,
      startedAt: null,
      pausedAt: null
    });

    Graphs.update(copyGraphId, { $set: { sessionId } });

    const matching = {};
    const activities = Activities.find({ graphId }).fetch();
    activities.forEach(activity => {
      matching[activity._id] = addSessionItem(
        'activities',
        copyGraphId,
        activity
      );
    });

    const operators = Operators.find({ graphId }).fetch();
    operators.forEach(operator => {
      matching[operator._id] = addSessionItem(
        'operators',
        copyGraphId,
        operator
      );
    });

    const connections = Connections.find({ graphId }).fetch();
    connections.forEach(connection => {
      addSessionItem('connections', copyGraphId, {
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
    Graphs.remove({ sessionId });
    Activities.remove({ sessionId });
    Operators.remove({ sessionId });
    Connections.remove({ sessionId });
  }
});
