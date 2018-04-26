// @flow
import { Meteor } from 'meteor/meteor';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';

import { Logs } from '../imports/api/logs';
import { mergeLog, archiveDashboardState } from '../imports/api/mergeLogData';
import { activityTypesObj } from '../imports/activityTypes';
import { client } from './redis';

Meteor.methods({
  'session.logs': function(sessionId, limit = 50) {
    if (
      this.userId &&
      Meteor.users.findOne(this.userId).username === 'teacher'
    ) {
      return Logs.find({ sessionId }, { limit }).fetch();
    }
  },
  'session.find_start': function(sessionId) {
    if (
      this.userId &&
      Meteor.users.findOne(this.userId).username === 'teacher'
    ) {
      return Logs.findOne({ sessionId }, { sort: { timestamp: -1 } }).timestamp;
    }
  },
  'get.example.logs': function(ac, name, idx) {
    const rootPath = resolve('.').split('/.meteor')[0];
    const d = activityTypesObj[ac].dashboards[name];
    const examplePath =
      d && d.exampleLogs && d.exampleLogs[idx] && d.exampleLogs[idx].path;
    if (examplePath) {
      const log = readFileSync(join(rootPath, '..', examplePath), 'utf-8');
      return log
        .trim()
        .split('\n')
        .map(x => JSON.parse(x));
    } else {
      return false;
    }
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
