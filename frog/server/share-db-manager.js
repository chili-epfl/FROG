// @flow
import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';
import ShareDBMongo from 'sharedb-mongo';
import http from 'http';
import sharedbClient from 'sharedb/lib/client';
import { ReconnectingWebSocket } from 'rws';

declare var Promise: any;

let _serverConnection = {};
let _startShareDB = () => {};

if (Meteor.settings.public.sharedburl) {
  const shareDbUrl = Meteor.settings.public.sharedburl;
  const socket = new ReconnectingWebSocket(shareDbUrl);
  _serverConnection = new sharedbClient.Connection(socket);
} else {
  const dbUrl =
    (Meteor.settings && Meteor.settings.public.dburl) ||
    'mongodb://localhost:3001';
  const db = ShareDBMongo(`${dbUrl}/sharedb`);

  const server = http.createServer();
  const backend = new ShareDB({ db });
  _serverConnection = backend.connect();

  _startShareDB = () => {
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
}

export const serverConnection = _serverConnection;
export const startShareDB = _startShareDB;

export const getDoc = (docId: string): any => {
  const doc = serverConnection.get('rz', docId);
  Promise.await(new Promise(resolve => doc.fetch(() => resolve())));
  return doc.data;
};
