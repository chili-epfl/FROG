// @flow

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { type LogT, type LogDBT, uuid } from 'frog-utils';
import { Sessions } from './sessions';

export const Logs = new Mongo.Collection('logs');

export const engineLogger = (
  graphId: string,
  sessionId: string,
  type: string,
  value?: number
) =>
  Meteor.call(
    'merge.log',
    (Sessions.findOne({ _id: sessionId }).graphId,
    ({
      _id: uuid(),
      userId: 'teacher',
      sessionId,
      type,
      value
    }: $Diff<LogDBT, { timestamp: Date }>))
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
    const graphId = Sessions.findOne({ _id: sessionId }).graphId;
    Meteor.call('merge.log', graphId, logItem, logExtra);
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
