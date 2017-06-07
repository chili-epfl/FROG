// @flow

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Presences } from 'meteor/tmeasday:presence';

import { uuid } from 'frog-utils';

import { Activities, Operators, Connections } from './activities';
import { Graphs, addGraph } from './graphs';
import { runSession, nextActivity } from './engine';

export const restartSession = session =>
  Meteor.call('sessions.restart', session);
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
};

export const updateOpenActivities = (
  sessionId: string,
  openActivities: Array<string>,
  timeInGraph: number
) => {
  Sessions.update(
    { _id: sessionId },
    { $set: { openActivities, timeInGraph } }
  );
  if (Meteor.isServer) {
    openActivities.forEach(activityId => {
      Meteor.call('dataflow.run', 'activity', activityId, sessionId);
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
    return sessionId;
  },
  'flush.session': sessionId => {
    const graphId = Sessions.findOne(sessionId).graphId;
    Sessions.remove(sessionId);
    Graphs.remove(graphId);
    Activities.remove({ graphId });
    Operators.remove({ graphId });
    Connections.remove({ graphId });
  },
  'sessions.restart': session => {
    const graphId = session.fromGraphId;
    Meteor.call('flush.session', session._id);
    const newSessionId = Meteor.call('add.session', graphId);
    Meteor.call('session.joinall', newSessionId);
    runSession(newSessionId);
    nextActivity(newSessionId);
  }
});
