// @flow
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid, getSlug } from 'frog-utils';
import { difference } from 'lodash';

import { Activities, Operators, Connections } from './activities';
import { runSessionFn, runNextActivity } from './engine';
import { Graphs, addGraph } from './graphs';
import valid from './validGraphFn';

const SessionTimeouts = {};
const DEFAULT_COUNTDOWN_LENGTH = 10000;

export const Sessions = new Mongo.Collection('sessions');

export const restartSession = (session: Object) => {
  const graph = Graphs.findOne(session.graphId);
  if (!graph || graph.broken) {
    // eslint-disable-next-line no-alert
    window.alert('Cannot restart session, graph currently broken');
    return;
  }
  Meteor.call('sessions.restart', session);
};

Meteor.methods({
  'sessions.restart': session => {
    if (Meteor.isServer) {
      const graphId = session.graphId;
      if (!graphId || !session) {
        return;
      }
      sessionCancelCountDown(session._id);
      Sessions.update(session._id, { $set: { slug: session.slug + '-old' } });
      const newSessionId = addSessionFn(graphId, session.slug);
      if (session.settings) {
        Sessions.update(newSessionId, {
          $set: { settings: session.settings }
        });
      }
      runSessionFn(newSessionId);
    }
  }
});

export const setTeacherSession = (sessionId: string) => {
  Meteor.users.update(Meteor.userId(), {
    $set: { 'profile.controlSession': sessionId }
  });
};

export const addSession = (graphId: string) => {
  Meteor.call('add.session', graphId, null, (err, result) => {
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
  if (Meteor.isServer) {
    Sessions.update(sessionId, { $set: { state: 'WAITINGFORNEXT' } });
    const oldOpen = Sessions.findOne(sessionId).openActivities;
    difference(oldOpen, openActivities).forEach(activityId =>
      Activities.update(activityId, { $set: { actualClosingTime: new Date() } })
    );
    openActivities.forEach(activityId => {
      Meteor.call('dataflow.run', 'activity', activityId, sessionId);
      Activities.update(
        {
          _id: activityId,
          actualStartingTime: { $exists: false }
        },
        {
          $set: { actualStartingTime: new Date() }
        }
      );
    });
  }
  Sessions.update(sessionId, {
    $set: { openActivities, timeInGraph, state: 'STARTED' }
  });
};

export const removeSession = (sessionId: string) =>
  Meteor.call('flush.session', sessionId);

const addSessionFn = (graphId: string, slug: string): string => {
  if (Meteor.isServer) {
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
    const match = graph.name.match(/(.+)\(([^(]+)\)$/);
    let newName;
    if (match) {
      newName = match[1] + ' (' + (parseInt(match[2], 10) + 1) + ')';
    } else {
      newName = graph.name + ' (2)';
    }
    if (newName[0] !== '#') {
      newName = '#' + newName;
    }
    const copyGraphId = addGraph({
      graph: { ...graph, name: newName },
      activities: Activities.find({ graphId }).fetch(),
      operators: Operators.find({ graphId }).fetch(),
      connections: Connections.find({ graphId }).fetch()
    });

    let newSlug = slug;
    if (!slug) {
      let slugSize = 4;
      const slugs = Sessions.find({}, { fields: { slug: 1 } })
        .fetch()
        .map(x => x.slug);
      newSlug = getSlug(slugSize);
      while (slugs.includes(newSlug)) {
        newSlug = getSlug(slugSize);
        slugSize += 1;
      }
    }

    Sessions.insert({
      _id: sessionId,
      fromGraphId: graphId,
      name: newName,
      graphId: copyGraphId,
      state: 'CREATED',
      timeInGraph: -1,
      countdownStartTime: -1,
      countdownLength: DEFAULT_COUNTDOWN_LENGTH,
      pausedAt: null,
      openActivities: [],
      slug: newSlug
    });
    Graphs.update(copyGraphId, { $set: { sessionId } });

    setTeacherSession(sessionId);
    return sessionId;
  }
  return '';
};

Meteor.methods({
  'add.session': addSessionFn,
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
  'set.timeout': (delay, id) => {
    if (Meteor.isServer) {
      const callback = () => {
        updateSessionCountdownStartTime(id, -1);
        updateSessionCountdownLength(id, DEFAULT_COUNTDOWN_LENGTH);
        runNextActivity(id);
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
