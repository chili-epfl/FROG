// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { type LogT, type LogDBT, uuid } from 'frog-utils';

export const Logs = new Mongo.Collection('logs');

export const engineLogger = (
  sessionId: string,
  type: string,
  itemId?: string,
  payload: Object
) =>
  Meteor.call(
    'merge.log',
    ({
      _id: uuid(),
      sessionId,
      userId: 'teacher',
      timestamp: new Date(),
      type,
      itemId,
      payload
    }: LogDBT)
  );

export const createLogger = (
  sessionId: string,
  instanceId: string,
  activity: Object
) => {
  const logger = (logItem: LogT) => {
    const log = ({
      _id: uuid(),
      userId: Meteor.userId(),
      sessionId,
      activityType: activity.type,
      activityId: activity._id,
      instanceId,
      timestamp: new Date(),
      ...logItem
    }: LogDBT);
    Meteor.call('merge.log', (log: LogDBT));
  };
  return logger;
};
