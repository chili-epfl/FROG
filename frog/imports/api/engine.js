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

export const runSession = (sessionId: string) =>
  Meteor.call('run.session', sessionId);

export const nextActivity = (sessionId: string) =>
  Meteor.call('next.activity', sessionId);

const runNextActivity = (sessionId: string) => {
  if (Meteor.isServer) {
    sessionCancelCountDown(sessionId);
    const session = Sessions.findOne(sessionId);
    const activities = Activities.find({ graphId: session.graphId }).fetch();
    const [t0, t1] = [
      ...new Set(
        [
          ...activities.map(a => a.startTime),
          ...activities.map(a => a.startTime + a.length)
        ].filter(t => t > session.timeInGraph)
      )
    ]
      .sort((a, b) => a - b)
      .slice(0, 2);
    const newTimeInGraph = t1 ? (t0 + t1) / 2 : -1;

    const openActivities = activities.filter(
      a =>
        a.startTime <= newTimeInGraph && a.startTime + a.length > newTimeInGraph
    );

    const openActivityIds = openActivities.map(x => x._id);
    updateOpenActivities(sessionId, openActivityIds, newTimeInGraph);
    if (openActivities.some(x => x.plane === 2)) {
      Sessions.update(sessionId, { $set: { tooLate: true } });
    }

    engineLogger(sessionId, { message: 'NEXT ACTIVITY' });
  }
};

Meteor.methods({
  'run.session': (sessionId: string) => {
    updateSessionState(sessionId, 'STARTED');
    Sessions.update(sessionId, { $set: { startedAt: Date.now() } });
    engineLogger(sessionId, { message: 'STARTING SESSION' });
  },
  'next.activity': runNextActivity
});
