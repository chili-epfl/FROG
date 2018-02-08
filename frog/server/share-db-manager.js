// @flow
import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';
import ShareDBMongo from 'sharedb-mongo';
import http from 'http';
import RedisPubsub from 'sharedb-redis-pubsub';
declare var Promise: any;

const dbUrl =
  (Meteor.settings && Meteor.settings.sharedb_dburl) ||
  'mongodb://localhost:3001';
const db = ShareDBMongo(`${dbUrl}/sharedb`);

const server = http.createServer();
let options = { db };
if (Meteor.settings.sharedb_redis) {
  const redis = new RedisPubsub({
    url: 'redis://' + Meteor.settings.sharedb_redis
  });
  options = { ...options, pubsub: redis };
}
const backend = new ShareDB(options);
export const serverConnection = backend.connect();

export const startShareDB = () => {
  if (!Meteor.settings.dont_start_sharedb) {
    const wserver = new WebSocket.Server({ server });
    wserver.on('connection', ws => {
      ws.on('error', e => null);
      backend.listen(new WebsocketJSONStream(ws));
    });
    // eslint-disable-next-line no-console
    console.info('Running shareDB server');

    const shareDbPort =
      (Meteor.settings && Meteor.settings.public.sharedbport) || 3002;
    // $FlowFixMe
    server.listen(shareDbPort, err => {
      if (err) throw err;
    });
  }
};
