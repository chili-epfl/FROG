'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var sharedb = require('sharedb');
var WebSocket = require('ws');
var WebsocketJSONStream = require('websocket-json-stream');
var shareDBMongo = require('sharedb-mongo');
var http = require('http');
var RedisPubsub = require('sharedb-redis-pubsub');

var dbUrl =
  (process.env && process.env.FROG_MONGOURL) || 'mongodb://localhost:27300';
var db = shareDBMongo(dbUrl + '/sharedb');

var server = http.createServer();
var redis = new RedisPubsub({ url: 'redis://207.154.211.32' });
var backend = new sharedb({ db: db, pubsub: redis });
var serverConnection = (exports.serverConnection = backend.connect());

var startShareDB = (exports.startShareDB = function startShareDB() {
  new WebSocket.Server({ server: server }).on('connection', function(ws) {
    backend.listen(new WebsocketJSONStream(ws));
  });

  var shareDbPort = (process.env && process.env.SHAREDBPORT) || 3002;
  server.listen(shareDbPort, function(err) {
    if (err) throw err;
  });
  console.log('FROG ShareDB server started on port ' + shareDbPort);
});

startShareDB();
