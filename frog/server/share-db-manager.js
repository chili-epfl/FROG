// @flow
import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';
import ShareDBMongo from 'sharedb-mongo';
import http from 'http';
import RedisPubsub from 'sharedb-redis-pubsub';
import json from 'ot-json0';
import { cloneDeep, isEmpty } from 'lodash';

declare var Promise: any;
const server = http.createServer();

const dbUrl =
  (Meteor.settings && Meteor.settings.sharedb_dburl) ||
  'mongodb://localhost:3001';

const db = ShareDBMongo(`${dbUrl}/sharedb`);

let options = { db };
if (Meteor.settings.sharedb_redis) {
  const redis = new RedisPubsub({
    url: 'redis://' + Meteor.settings.sharedb_redis
  });
  options = { ...options, pubsub: redis };
}

let backend;
try {
  backend = new ShareDB(options);
} catch (e) {
  backend = new ShareDB({
    ...options,
    db: ShareDBMongo('mongodb://localhost:27017/sharedb')
  });
}
export const serverConnection = backend.connect();
Meteor.methods({
  'sharedb.get.revisions': (coll, id) =>
    new Promise(resolve =>
      backend.db.getOps(coll, id, 0, null, {}, (err, res) => {
        console.log(coll, id, err, res);
        if (err || isEmpty(res)) {
          resolve([]);
          return;
        }
        console.log(res);
        const beg = res.shift().create.data;
        const revisions = res.reduce(
          (acc, x) => {
            const result = json.type.apply(
              cloneDeep(acc[acc.length - 1]),
              x.op
            );
            return [...acc, result];
          },
          [beg]
        );
        console.log(revisions);
        resolve(revisions);
      })
    ).catch(e => console.error(e))
});

export const startShareDB = () => {
  if (!Meteor.settings.dont_start_sharedb) {
    const wserver = new WebSocket.Server({ server });
    wserver.on('connection', ws => {
      ws.on('error', () => null);
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
