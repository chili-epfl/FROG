// @flow

import { Meteor } from 'meteor/meteor';

import { Activities } from './activities';
import {
  Sessions,
  updateSessionState,
  updateOpenActivities,
  sessionCancelCountDown
} from './sessions';
import { engineLogger } from './logs';
import { calculateNextOpen } from './graphSequence';

export const runSession = (sessionId: string) =>
  Meteor.call('run.session', sessionId);

export const nextActivity = (sessionId: string) =>
  Meteor.call('next.activity', sessionId);

const runNextActivity = (sessionId: string) => {
  if (Meteor.isServer) {
    sessionCancelCountDown(sessionId);
    const session = Sessions.findOne(sessionId);
    const oldOpen = [...session.openActivities];
    const activities = Activities.find({ graphId: session.graphId }).fetch();

    const [newTimeInGraph, openActivities] = calculateNextOpen(
      session.timeInGraph,
      activities
    );
    const openActivityIds = openActivities.map(x => x._id);
    updateOpenActivities(sessionId, openActivityIds, newTimeInGraph);
    if (openActivities.some(x => x.plane === 2)) {
      Sessions.update(sessionId, { $set: { tooLate: true } });
    }

    engineLogger(sessionId, 'nextActivity');
    const justClosedActivities = oldOpen.filter(
      act => !openActivities.includes(act)
    );
    justClosedActivities.forEach(act =>
      Meteor.call('reactive.to.product', act)
    );
  }
};

Meteor.methods({
  'run.session': (sessionId: string) => {
    updateSessionState(sessionId, 'STARTED');
    Sessions.update(sessionId, { $set: { startedAt: Date.now() } });
    engineLogger(sessionId, 'startSession');
  },
  'next.activity': runNextActivity
});
