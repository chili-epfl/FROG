// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { uuid } from 'frog-utils';

export const Logs = new Mongo.Collection('logs');

export const engineLogger = (sessionId: string, payload: Object) =>
  Meteor.call('merge.log', {
    payload,
    userId: 'teacher',
    sessionId,
    createdAt: new Date(),
    _id: uuid()
  });

export const createLogger = (
  sessionId: string,
  instanceId: string,
  activity: Object
) => {
  const logger = (payload: any) => {
    const log = {
      userId: Meteor.userId(),
      sessionId,
      activityId: activity._id,
      activityType: activity.activityType,
      instanceId,
      payload,
      updatedAt: Date()
    };
    Meteor.call('merge.log', log);
  };
  return logger;
};
