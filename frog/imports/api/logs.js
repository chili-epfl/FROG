// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { type LogT, type LogDBT, uuid } from 'frog-utils';

export const Logs = new Mongo.Collection('logs');

export const engineLogger = (sessionId: string, type: string, value?: number) =>
  Meteor.call(
    'merge.log',
    ({
      _id: uuid(),
      userId: 'teacher',
      sessionId,
      type,
      value
    }: $Diff<LogDBT, { timestamp: Date }>)
  );

export const createLogger = (
  sessionId: string,
  instanceId: string,
  activity: Object,
  userId?: string
) => {
  const logger = (logItem: LogT | LogT[]) => {
    const logExtra = ({
      userId: userId || Meteor.userId(),
      sessionId,
      activityType: activity.activityType,
      activityPlane: activity.plane,
      activityId: activity._id,
      instanceId
    }: $Diff<LogDBT, { timestamp: Date }>);

    Meteor.call('merge.log', logItem, logExtra);
  };
  return logger;
};

export const createDashboardCollection = (
  serverConnection: Object,
  activityId: string,
  activityType: Object
) => {
  const doc = serverConnection.get('rz', 'DASHBOARD//' + activityId);
  doc.fetch();
  doc.once(
    'load',
    Meteor.bindEnvironment(() => {
      if (!doc.type) {
        try {
          doc.create(
            (activityType.dashboard && activityType.dashboard.initData) || {}
          );
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(Date.now(), 'Creating dashboard for ', activityId, e);
        }
      }
    })
  );
};
