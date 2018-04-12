// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { type LogT, type LogDBT, uuid } from 'frog-utils';

export const Logs = new Mongo.Collection('logs');

export const logLogin = (sessionId: string) => {
  Meteor.call('merge.log', {
    userId: Meteor.userId(),
    sessionId,
    type: 'Logged in'
  });
};

export const engineLogger = (sessionId: string, type: string, value?: number) =>
  Meteor.call(
    'merge.log',
    ({
      _id: uuid(),
      userId: Meteor.userId(),
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
    const user = Meteor.users.findOne(userId || Meteor.userId());
    const logExtra = ({
      userId: userId || user._id,
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

export const dashDocId = (aId: string, name: string) =>
  aId + '/dashboard/' + name;

export const createDashboardCollection = (
  serverConnection: Object,
  activityId: string,
  activityType: Object
) => {
  if (activityType.dashboard) {
    Object.keys(activityType.dashboard).forEach(name => {
      const dashObj = activityType.dashboard[name];
      const docId = dashDocId(activityId, name);
      const doc = serverConnection.get('rz', docId);
      doc.fetch();
      doc.once(
        'load',
        Meteor.bindEnvironment(() => {
          if (!doc.type) {
            try {
              doc.create((dashObj && dashObj.initData) || {});
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(
                Date.now(),
                'Creating dashboard for ',
                activityId,
                e
              );
            }
          }
        })
      );
    });
  }
};
