import { Meteor } from 'meteor/meteor';
import redis from 'redis';
import { mergeLog } from '../imports/api/mergeLogData';
import { archiveDashboardState } from './dashboardSubscription';

let clientRaw = null;
if (
  Meteor.settings.sendLogsToExternalDashboardServer ||
  Meteor.settings.dashboardServer
) {
  clientRaw = redis.createClient();
  clientRaw.on('error', e => {
    console.error('Redis error', e);
  });
}

export const client = clientRaw;

const loop = (err, result) => {
  if (err) {
    console.error('Incoming redis log message error', err);
  }
  if (result[0] === 'frog.logs') {
    const msg = JSON.parse(result[1]);
    mergeLog(msg[0], msg[1], msg[2], false, true);
  } else if (result[0] === 'frog.archive') {
    archiveDashboardState(result[1]);
  }
  client.blpop('frog.logs', 'frog.archive', 0, Meteor.bindEnvironment(loop));
};

if (Meteor.settings.dashboardServer && client) {
  client.blpop('frog.logs', 'frog.archive', 0, Meteor.bindEnvironment(loop));
}
