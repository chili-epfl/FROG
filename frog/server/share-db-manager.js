// @flow
import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';
import ShareDBMongo from 'sharedb-mongo';
import http from 'http';

declare var Promise: any;
const dbUrl =
  (Meteor.settings && Meteor.settings.public.dburl) ||
  'mongodb://localhost:3001';
const db = ShareDBMongo(`${dbUrl}/sharedb`);

const server = http.createServer();
const backend = new ShareDB({ db });
export const serverConnection = backend.connect();

export const startShareDB = () => {
  new WebSocket.Server({ server }).on('connection', ws => {
    backend.listen(new WebsocketJSONStream(ws));
  });

  const shareDbPort =
    (Meteor.settings && Meteor.settings.public.sharedbport) || 3002;
  // $FlowFixMe
  server.listen(shareDbPort, err => {
    if (err) throw err;
  });
};

export const getDoc = (docId: string): any => {
  const doc = serverConnection.get('rz', docId);
  Promise.await(new Promise(resolve => doc.fetch(() => resolve())));
  return doc.data;
};
