import { Meteor } from 'meteor/meteor';
import redis from 'redis';
import { mergeLog } from '../imports/api/mergeLogData';
import { archiveDashboardState } from './dashboardSubscription';

console.log('import redis');
let clientRaw = null;
if (
  Meteor.settings.sendLogsToExternalDashboardServer ||
  Meteor.settings.dashboardServer
) {
  console.log('create client');
  clientRaw = redis.createClient();
  clientRaw.on('error', e => {
    console.error('Redis error', e);
  });
}

export const client = clientRaw;

const loop = (err, result) => {
  console.log('REDIS LOOP');
  if (err) {
    console.error('Incoming redis log message error', err);
  }
  if (result[0] === 'frog.logs') {
    try {
      const msg = JSON.parse(result[1]);
      console.log('INCOMING MSG', msg);
      mergeLog(msg[0], msg[1], msg[2], false, true);
    } catch (e) {
      console.error('Parsing/merging Redis log', msg, e);
    }
  } else if (result[0] === 'frog.archive') {
    console.log('ARCHIVE DASHBOARD', result[1]);
    try {
      archiveDashboardState(result[1]);
    } catch (e) {
      console.error('Archive dashboard state', result[1], e);
    }
  }
  client.blpop('frog.logs', 'frog.archive', 0, Meteor.bindEnvironment(loop));
};

if (Meteor.settings.dashboardServer && client) {
  console.log('start loop');
  client.blpop('frog.logs', 'frog.archive', 0, Meteor.bindEnvironment(loop));
}
