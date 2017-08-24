// @flow
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Presences } from 'meteor/tmeasday:presence';
import { compact } from 'lodash';

import { uuid } from 'frog-utils';

import { Activities, Operators, Connections } from './activities';
import { runSession, nextActivity } from './engine';
import { Graphs, addGraph } from './graphs';
import valid from './validGraphFn';

export const restartSession = (session: { fromGraphId: string, _id: string }) =>
  Meteor.call('sessions.restart', session);
export const Sessions = new Mongo.Collection('sessions');

export const setTeacherSession = (sessionId: string) => {
  Meteor.users.update(
    { _id: Meteor.userId() },
    { $set: { 'profile.controlSession': sessionId } },
  );
};

export const setStudentSession = (sessionId: string) => {
  Meteor.users.update(
    { _id: Meteor.userId() },
    { $set: { 'profile.currentSession': sessionId } },
  );
};

const addSessionItem = (type, graphId, params) => {
  const id = uuid();
  const collections = {
    activities: Activities,
    operators: Operators,
    connections: Connections,
  };
  collections[type].insert({
    ...params,
    createdAt: new Date(),
    graphId,
    _id: id,
  });
  return id;
};

export const addSession = (graphId: string) => {
  Meteor.call('add.session', graphId, (err, result) => {
    if (result === 'invalidGraph') {
      // eslint-disable-next-line no-alert
      window.alert(
        'Cannot create session from invalid graph. Please open graph in graph editor and correct errors.',
      );
    }
  });
};

export const updateSessionState = (id: string, state: string) => {
  Sessions.update(id, { $set: { state } });
};

export const updateSessionCountdownTimeLeft = (
  id: string,
  countdownTimeLeft: number,
) => Sessions.update(id, { $set: { countdownTimeLeft } });

export const updateSessionCountdownStartTime = (
  id: string,
  countdownStartTime: number,
) => Sessions.update(id, { $set: { countdownStartTime } });

export const updateOpenActivities = (
  sessionId: string,
  openActivities: Array<string>,
  timeInGraph: number,
) => {
  Sessions.update(
    { _id: sessionId },
    { $set: { openActivities, timeInGraph } },
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
    const currentUsers = compact(Presences.find().fetch().map(x => x.userId));
    Meteor.users.update(
      { _id: { $in: currentUsers }, username: { $not: { $eq: 'teacher' } } },
      { $set: { 'profile.currentSession': sessionId } },
      { multi: true },
    );
  },
  'add.session': graphId => {
    const validOutput = valid(
      Activities.find({ graphId }).fetch(),
      Operators.find({ graphId }).fetch(),
      Connections.find({ graphId }).fetch(),
    );
    if (validOutput.errors.filter(x => x.severity === 'error').length > 0) {
      Graphs.update(graphId, { $set: { broken: true } });
      return 'invalidGraph';
    }

    const sessionId = uuid();
    const graph = Graphs.findOne(graphId);
    const count = Graphs.find({
      name: { $regex: '#' + graph.name + '*' },
    }).count();
    const sessionName = '#' + graph.name + ' ' + (count + 1);
    const copyGraphId = addGraph(sessionName);

    Sessions.insert({
      _id: sessionId,
      fromGraphId: graphId,
      name: sessionName,
      graphId: copyGraphId,
      state: 'CREATED',
      timeInGraph: -1,
      countdownStartTime: -1,
      countdownTimeLeft: 30000,
      pausedAt: null,
    });

    Graphs.update(copyGraphId, { $set: { sessionId } });

    const matching = {};
    const activities = Activities.find({ graphId }).fetch();
    activities.forEach(activity => {
      matching[activity._id] = addSessionItem(
        'activities',
        copyGraphId,
        activity,
      );
    });

    const operators = Operators.find({ graphId }).fetch();
    operators.forEach(operator => {
      matching[operator._id] = addSessionItem(
        'operators',
        copyGraphId,
        operator,
      );
    });

    const connections = Connections.find({ graphId }).fetch();
    connections.forEach(connection => {
      addSessionItem('connections', copyGraphId, {
        source: {
          id: matching[connection.source.id],
          type: connection.source.type,
        },
        target: {
          id: matching[connection.target.id],
          type: connection.target.type,
        },
      });
    });
    setTeacherSession(sessionId);
    return sessionId;
  },
  'flush.session': sessionId => {
    const session = Sessions.findOne(sessionId);
    if (!session) {
      return;
    }
    const graphId = session.graphId;
    Sessions.remove(sessionId);
    Graphs.remove(graphId);
    Activities.remove({ graphId });
    Operators.remove({ graphId });
    Connections.remove({ graphId });
  },
  'sessions.restart': session => {
    const graphId = session.fromGraphId;
    if (!graphId || !session) {
      return;
    }
    Meteor.call('flush.session', session._id);
    const newSessionId = Meteor.call('add.session', graphId);
    Meteor.call('session.joinall', newSessionId);
    runSession(newSessionId);
    nextActivity(newSessionId);
  },
});
