// @flow
import { Meteor } from 'meteor/meteor';

import { Logs } from '../imports/api/logs';
import { Sessions } from '../imports/api/sessions';
import { mergeLog } from '../imports/api/mergeLogData';
import { client } from './redis';
import { archiveDashboardState } from './dashboardSubscription';

Meteor.methods({
  'session.logs': function(sessionId, limit = 50) {
    if (Sessions.findOne(sessionId).ownerId === this.userId) {
      return Logs.find({ sessionId }, { limit }).fetch();
    } else
      console.error(
        'Not permitted to download logs',
        Sessions.findOne(sessionId),
        this.userId
      );
    throw new Meteor.Error(
      'not-a-teacher',
      'You have to be the teacher of a session to download its logs'
    );
  },
  'session.find_start': function(sessionId) {
    if (Sessions.findOne(sessionId).ownerId === this.userId) {
      return Logs.findOne({ sessionId }, { sort: { timestamp: -1 } }).timestamp;
    } else
      throw new Meteor.Error(
        'not-a-teacher',
        'You have to be the teacher of a session to download its logs'
      );
  }
});

if (Meteor.settings.sendLogsToExternalDashboardServer) {
  Meteor.methods({
    'merge.log': (rawLog, logExtra, suppliedActivity) => {
      client.rpush(
        'frog.logs',
        JSON.stringify([rawLog, logExtra, suppliedActivity])
      );
      mergeLog(rawLog, logExtra, suppliedActivity, true);
    },
    'archive.dashboard.state': activityId =>
      client.rpush('frog.archive', activityId)
  });
} else {
  Meteor.methods({
    'merge.log': (rawLog, logExtra, suppliedActivity) => {
      mergeLog(rawLog, logExtra, suppliedActivity);
    },
    'archive.dashboard.state': archiveDashboardState
  });
}
