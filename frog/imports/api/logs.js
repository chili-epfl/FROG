// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { type LogT, type LogDBT, uuid } from 'frog-utils';

export const Logs = new Mongo.Collection('logs');

export const engineLogger = (sessionId: string, type: string) =>
  Meteor.call(
    'merge.log',
    ({
      _id: uuid(),
      userId: 'teacher',
      timestamp: new Date(),
      sessionId,
      type
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
      activityType: activity.activityType,
      activityPlane: activity.plane,
      activityId: activity._id,
      instanceId: activity.plane === 2 ? instanceId : undefined,
      timestamp: new Date(),
      ...logItem
    }: LogDBT);

    Meteor.call('merge.log', (log: LogDBT));
  };
  return logger;
};
