// @flow

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { type ActivityDbT } from '/imports/frog-utils';

import { Activities, Connections, UniqueIds } from './activities';
import { Products } from './products';
import { Operators } from './operators';
import { Objects } from './objects';
import {
  Sessions,
  updateSessionState,
  updateOpenActivities,
  sessionCancelCountDown
} from './sessions';
import { engineLogger } from './logs';
import { calculateNextOpen, getPrevTime } from './graphSequence';

export const nextActivity = (sessionId: string) =>
  Meteor.call('next.activity', sessionId);

export const goBack = (sessionId: string) =>
  Meteor.call('graph.goBack', sessionId);

export const updateNextOpenActivities = (
  sessionId: string,
  timeInGraph: number,
  activities: ActivityDbT[]
) => {
  const [_, futureOpen] = calculateNextOpen(timeInGraph, activities);
  const nextActivities = futureOpen.map(x => ({
    activityId: x._id,
    description: `${x.title || ''} (${
      x.plane === 4 ? 'teacher task' : 'p' + (x.plane || '')
    })`
  }));
  Sessions.update(sessionId, {
    $set: { nextActivities }
  });
};

export const runNextActivity = (sessionId: string) => {
  if (Meteor.isServer) {
    sessionCancelCountDown(sessionId);
    const session = Sessions.findOne(sessionId);
    const oldOpen = [...session.openActivities];
    const activities = Activities.find({ graphId: session.graphId }).fetch();

    const [newTimeInGraph, openActivities, final] = calculateNextOpen(
      session.timeInGraph,
      activities,
      sessionId
    );
    const justClosedActivities = oldOpen.filter(actId => {
      const act = Activities.findOne(actId);
      return act.startTime + act.length < newTimeInGraph;
    });
    justClosedActivities.forEach(act => {
      Meteor.call('archive.dashboard.state', act);
    });
    const openActivityIds = openActivities.map(x => x._id);
    updateOpenActivities(sessionId, openActivityIds, newTimeInGraph);
    if (openActivities.some(x => x.plane === 2)) {
      Sessions.update(sessionId, { $set: { tooLate: true } });
    }

    engineLogger(sessionId, 'teacher.nextActivity', newTimeInGraph);
    updateNextOpenActivities(sessionId, newTimeInGraph, activities);
    if (final) {
      Sessions.update(sessionId, {
        $set: { state: 'FINISHED', nextOpenActivities: [] }
      });
    } else {
      const [_, _2, last] = calculateNextOpen(
        newTimeInGraph,
        activities,
        sessionId
      );
      if (last) {
        Sessions.update(sessionId, {
          $set: { lastActivity: true }
        });
      }
    }
  }
};

const findAllStartTimes = (operator, operators, connections, activities) => {
  if (!operator) {
    return [];
  }
  return connections
    .filter(x => x.source.id === operator._id)
    .flatMap(x =>
      x.target.type === 'activity'
        ? activities.find(act => act._id === x.target.id)?.startTime
        : findAllStartTimes(
            operators.find(op => op._id === x.target.id),
            operators,
            connections,
            activities
          )
    );
};

export const graphGoBack = (sessionId: string) => {
  if (Meteor.isServer) {
    sessionCancelCountDown(sessionId);
    const session = Sessions.findOne(sessionId);
    const oldOpen = [...session.openActivities];
    const activities = Activities.find({ graphId: session.graphId }).fetch();
    const operators = Operators.find({
      graphId: session.graphId,
      state: 'computed'
    }).fetch();
    const connections = Connections.find({ graphId: session.graphId }).fetch();

    const [newTimeInGraph, openActivities] = getPrevTime(
      activities,
      session.timeInGraph
    );
    oldOpen
      .filter(x => !openActivities.includes(x))
      .forEach(x =>
        Activities.update(x, { $unset: { state: '', actualStartTime: '' } })
      );

    operators.forEach(op => {
      const starts = findAllStartTimes(op, operators, connections, activities);
      if (starts.every(start => start >= newTimeInGraph)) {
        Operators.update(op._id, { $unset: { state: '' } });
        Products.remove(op._id);
        Objects.remove(op._id);
      }
    });

    const openActivityIds = openActivities.map(x => x._id);
    updateOpenActivities(sessionId, openActivityIds, newTimeInGraph);

    engineLogger(sessionId, 'teacher.prevActivity', newTimeInGraph);
    updateNextOpenActivities(sessionId, newTimeInGraph, activities);
  }
};

export const runSessionFn = (sessionId: string) => {
  updateSessionState(sessionId, 'READY');
  Sessions.update(sessionId, { $set: { startedAt: Date.now() } });
  engineLogger(sessionId, 'teacher.startSession');
  const session = Sessions.findOne(sessionId);
  if (Meteor.isServer) {
    if (session.settings?.studentlist) {
      const studentlist = session.settings.studentlist.split('\n');
      studentlist.forEach(student => {
        const { userId } = Accounts.updateOrCreateUserFromExternalService(
          'frog',
          {
            id: student
          }
        );
        Meteor.users.update(userId, { $set: { username: student } });
        const joined = Meteor.users.findOne(userId).joinedSessions;
        if (!joined || !joined.includes(session.slug)) {
          Meteor.users.update(userId, {
            $push: { joinedSessions: session.slug }
          });
        }
      });
    }

    const uniqueIds = Activities.find({
      graphId: session.graphId,
      'data.uniqueId': { $exists: true }
    });
    uniqueIds.forEach(act =>
      UniqueIds.update(
        act._id,
        { activityUniqueId: act.data.uniqueId },
        { upsert: true }
      )
    );
  }
};

Meteor.methods({
  'next.activity': runNextActivity,
  'graph.goBack': graphGoBack
});
