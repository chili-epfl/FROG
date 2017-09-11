// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { uuid } from 'frog-utils';

export const Logs = new Mongo.Collection('logs');

export const engineLogger = (sessionId: string, log: Object) =>
  Meteor.call('merge.log', {
    payload: log,
    userId: 'teacher',
    sessionId,
    createdAt: new Date(),
    _id: uuid()
  });

export const createLogger = (sessionId: string, activity: Object) => {
  const logger = (log: Object) => {
    const toLog = {
      userId: Meteor.userId(),
      sessionId,
      activityId: activity._id,
      activityType: activity.activityType,
      payload: log,
      updatedAt: Date()
    };
    Meteor.call('merge.log', toLog, activity);
  };
  return logger;
};
