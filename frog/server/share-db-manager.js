// @flow
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';
import ShareDBMongo from 'sharedb-mongo';
import http from 'http';

declare var Promise: any;

const db = ShareDBMongo('mongodb://localhost:3001/sharedb');
const server = http.createServer();
const backend = new ShareDB({ db });
export const serverConnection = backend.connect();

export const startShareDB = () => {
  new WebSocket.Server({ server }).on('connection', ws => {
    backend.listen(new WebsocketJSONStream(ws));
  });

  server.listen(3002, err => {
    if (err) throw err;
  });
};

export const getDoc = (docId: string): any => {
  const doc = serverConnection.get('rz', docId);
  Promise.await(new Promise(resolve => doc.fetch(() => resolve())));
  return doc.data;
};
