// @flow

import { Meteor } from 'meteor/meteor';

import type { SocialStructureT, ProductT, ObjectT } from 'frog-utils';

import { Activities, Connections, Operators } from './activities';
import { Sessions, updateSessionState, updateOpenActivities } from './sessions';
import { engineLogger } from './logs';
import { Products, addNodeProduct } from './products';
import { addObject } from './objects';

import { operatorTypesObj } from '../operatorTypes';

export const runSession = (sessionId: string) =>
  Meteor.call('run.session', sessionId);

export const nextActivity = (sessionId: string) =>
  Meteor.call('next.activity', sessionId);

Meteor.methods({
  'run.session': (sessionId: string) => {
    updateSessionState(sessionId, 'STARTED');
    engineLogger(sessionId, { message: 'STARTING SESSION' });
  },
  'next.activity': (sessionId: string) => {
    const session = Sessions.findOne(sessionId);
    const activities = Activities.find({ graphId: session.graphId }).fetch();
    const newTimeInGraph = activities.reduce((t, a) => {
      if (a.startTime > session.timeInGraph) {
        return Math.min(t, a.startTime);
      }
      if (a.startTime + a.length > session.timeInGraph) {
        return Math.min(t, a.startTime + a.length);
      }
      return t;
    }, 999999);

    const openActivities = activities
      .filter(
        a =>
          a.startTime <= newTimeInGraph &&
          a.startTime + a.length > newTimeInGraph
      )
      .map(a => a._id);

    updateOpenActivities(sessionId, openActivities, newTimeInGraph);
    engineLogger(sessionId, { message: 'NEXT ACTIVITY' });
  }
});
