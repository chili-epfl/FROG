'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var sharedb = require('sharedb');
var WebSocket = require('ws');
var WebsocketJSONStream = require('websocket-json-stream');
var shareDBMongo = require('sharedb-mongo');
var http = require('http');

var dbUrl =
  (process.env && process.env.FROG_MONGOURL) || 'mongodb://localhost:3001';
var db = shareDBMongo(dbUrl + '/sharedb');
console.log(db);

var server = http.createServer();
var backend = new sharedb({ db: db });
console.log(backend);
var serverConnection = (exports.serverConnection = backend.connect());
console.log(serverConnection);

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
