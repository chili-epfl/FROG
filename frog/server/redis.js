import redis from 'redis';
import { mergeLog } from '../imports/api/mergeLogData';
import { Meteor } from 'meteor/meteor';

export const client = redis.createClient();
client.on('connect', () => {
  console.info('Redis connection for dashboard processing');
});
client.on('error', e => {
  console.error('Redis error', e);
});

const loop = (err, result) => {
  if (err) {
    console.error('Incoming redis log message error', err);
  }
  console.log('Incoming message', result);
  const msg = JSON.parse(result[1]);
  mergeLog(msg[0], msg[1], msg[2], false, true);
  client.blpop('frog.logs', 0, Meteor.bindEnvironment(loop));
};

if (Meteor.settings.dashboardServer) {
  console.info('Beginning to listen for incoming log messages on Redis');
  client.blpop('frog.logs', 0, Meteor.bindEnvironment(loop));
}
