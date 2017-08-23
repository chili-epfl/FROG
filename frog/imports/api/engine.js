// @flow

import { Meteor } from 'meteor/meteor';

import { Activities } from './activities';
import { Sessions, updateSessionState, updateOpenActivities } from './sessions';
import { engineLogger } from './logs';

export const runSession = (sessionId: string) =>
  Meteor.call('run.session', sessionId);

export const nextActivity = (sessionId: string) =>
  Meteor.call('next.activity', sessionId);

export const setCountdown = (sessionId: string, on: boolean) =>
  Meteor.call('set.countdown', sessionId, on);

Meteor.methods({
  'run.session': (sessionId: string) => {
    updateSessionState(sessionId, 'STARTED');
    Sessions.update(sessionId, { $set: { startedAt: Date.now() } });
    engineLogger(sessionId, { message: 'STARTING SESSION' });
  },
  'next.activity': (sessionId: string) => {
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

    const openActivities = activities
      .filter(
        a =>
          a.startTime <= newTimeInGraph &&
          a.startTime + a.length > newTimeInGraph
      )
      .map(a => a._id);

    updateOpenActivities(sessionId, openActivities, newTimeInGraph);
    engineLogger(sessionId, { message: 'NEXT ACTIVITY' });
  },
  'set.countdown' : (sessionId: string, on: boolean) => {
    const session = Sessions.findOne(sessionId);
    Sessions.update(sessionId, { $set: { countdownOn: on} });
    // setTimeout(() => {
    //   const newTimeInGraph = t1 ? (t0 + t1) / 2 : -1;
    //
    //   const openActivities = activities
    //     .filter(
    //       a =>
    //         a.startTime <= newTimeInGraph &&
    //         a.startTime + a.length > newTimeInGraph
    //     )
    //     .map(a => a._id);
    //
    //   updateOpenActivities(sessionId, openActivities, newTimeInGraph);
    //   engineLogger(sessionId, { message: 'NEXT ACTIVITY' });
    // }, 1000*time);
  }
});
