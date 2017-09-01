// @flow
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Presences } from 'meteor/tmeasday:presence';
import { omit, compact, get, set, cloneDeep, isEqual } from 'lodash';
import traverse from 'traverse';

import { uuid } from 'frog-utils';

import { Activities, Operators, Connections } from './activities';
import { operatorTypesObj } from '../operatorTypes';
import { runSession, nextActivity } from './engine';
import { Graphs, addGraph } from './graphs';
import valid from './validGraphFn';

const SessionTimeouts = {};
const DEFAULT_COUNTDOWN_LENGTH = 10000;

export const restartSession = (session: { fromGraphId: string, _id: string }) =>
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
  Meteor.call('add.session', graphId, (err, result) => {
    if (result === 'invalidGraph') {
      // eslint-disable-next-line no-alert
      window.alert(
        'Cannot create session from invalid graph. Please open graph in graph editor and correct errors.'
      );
    }
  });
};

export const sessionStartCountDown = (
  sessionId: string,
  currentTime: number
) => {
  const session = Sessions.findOne(sessionId);
  updateSessionCountdownStartTime(sessionId, currentTime);
  Meteor.call('set.timeout', session.countdownLength, sessionId);
};

export const sessionCancelCountDown = (sessionId: string) => {
  updateSessionCountdownStartTime(sessionId, -1);
  updateSessionCountdownLength(sessionId, DEFAULT_COUNTDOWN_LENGTH);
  Meteor.call('clear.timeout', sessionId);
};

export const sessionChangeCountDown = (
  sessionId: string,
  modification: number,
  currentTime: number
) => {
  const session = Sessions.findOne(sessionId);
  Promise.resolve(
    updateSessionCountdownLength(
      sessionId,
      session.countdownLength + modification
    )
  ).then(() => {
    const session2 = Sessions.findOne(sessionId);
    if (session2.countdownStartTime > 0) {
      Meteor.call('clear.timeout', sessionId);
      Meteor.call(
        'set.timeout',
        session2.countdownStartTime + session2.countdownLength - currentTime,
        sessionId
      );
    }
  });
};

export const updateSessionState = (
  sessionId: string,
  state: string,
  currentTime: number = 0
) => {
  const session = Sessions.findOne(sessionId);
  switch (state) {
    case 'STARTED':
      if (session.countdownStartTime !== -1) {
        updateSessionCountdownStartTime(sessionId, currentTime);
        Meteor.call('set.timeout', session.countdownLength, sessionId);
      }
      break;
    case 'PAUSED':
      if (session.countdownStartTime !== -1) {
        updateSessionCountdownLength(
          sessionId,
          session.countdownStartTime + session.countdownLength - currentTime
        );
        updateSessionCountdownStartTime(sessionId, -2);
      }
      Meteor.call('clear.timeout', sessionId);
      break;
    case 'STOPPED':
      sessionCancelCountDown(sessionId);
      break;
    default:
  }
  Sessions.update(sessionId, { $set: { state } });
};

const updateSessionCountdownLength = (id: string, countdownLength: number) =>
  Sessions.update(id, { $set: { countdownLength } });

const updateSessionCountdownStartTime = (
  id: string,
  countdownStartTime: number
) => Sessions.update(id, { $set: { countdownStartTime } });

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
    const currentUsers = compact(Presences.find().fetch().map(x => x.userId));
    Meteor.users.update(
      { _id: { $in: currentUsers }, username: { $not: { $eq: 'teacher' } } },
      { $set: { 'profile.currentSession': sessionId } },
      { multi: true }
    );
  },
  'add.session': graphId => {
    const validOutput = valid(
      Activities.find({ graphId }).fetch(),
      Operators.find({ graphId }).fetch(),
      Connections.find({ graphId }).fetch()
    );
    if (validOutput.errors.filter(x => x.severity === 'error').length > 0) {
      Graphs.update(graphId, { $set: { broken: true } });
      return 'invalidGraph';
    }

    const sessionId = uuid();
    const graph = Graphs.findOne(graphId);
    const count = Graphs.find({
      name: { $regex: '#' + graph.name + '*' }
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
      countdownLength: DEFAULT_COUNTDOWN_LENGTH,
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

    operators.forEach(opid => {
      const op = Operators.findOne(matching[opid._id]);
      if (op.data) {
        const schema = operatorTypesObj[op.operatorType].config;
        const paths = traverse.paths(schema).filter(x => x.pop() === 'type');
        const activityPaths = paths.filter(
          x => get(schema, [...x, 'type']) === 'activity'
        );

        console.log('ap', activityPaths);
        const oldOp = cloneDeep(op);
        activityPaths.forEach(p => {
          const path = p.filter(y => y !== 'properties');
          console.log('path', path);
          console.log('opdata', op.data);
          console.log('get', get(op.data, path));
          const curRef = get(op.data, path);
          if (curRef) {
            console.log('set cur', op.data, path, matching[curRef]);
            set(op.data, path, matching[curRef]);
          }
        });
        if (!isEqual(oldOp, op)) {
          console.log('updating', matching[op._id]);
          Operators.update(op._id, omit(op, '_id'));
        }
      }
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
    sessionCancelCountDown(session._id);
    const newSessionId = Meteor.call('add.session', graphId);
    Meteor.call('session.joinall', newSessionId);
    runSession(newSessionId);
    nextActivity(newSessionId);
  },
  'set.timeout': (delay, id) => {
    if (Meteor.isServer) {
      const callback = () => {
        updateSessionCountdownStartTime(id, -1);
        updateSessionCountdownLength(id, DEFAULT_COUNTDOWN_LENGTH);
        nextActivity(id);
      };
      SessionTimeouts[id] = Meteor.setTimeout(callback, delay);
    }
    return null;
  },
  'clear.timeout': id => {
    if (Meteor.isServer) {
      Meteor.clearTimeout(SessionTimeouts[id]);
    }
    return null;
  }
});
