/* eslint-disable */
Object.defineProperty(exports, '__esModule', {
  value: true
});
const sharedb = require('sharedb');
const WebSocket = require('ws');
const WebsocketJSONStream = require('websocket-json-stream');
const shareDBMongo = require('sharedb-mongo');
const http = require('http');
const RedisPubsub = require('sharedb-redis-pubsub');

const dbUrl =
  (process.env && process.env.FROG_MONGOURL) || 'mongodb://localhost:27017';
const db = shareDBMongo(dbUrl + '/sharedb');

const server = http.createServer();

console.log(
  'This requires a Redis server and a MongoDB instance. Default URLs can be changed - Redis: redis://localhost:6379, Mongo: mongodb://localhost:27017. Use environment variables FROG_MONGOURL and FROG_REDISURL to modify default urls.'
);

const redisUrl =
  (process.env && process.env.FROG_REDISURL) || 'redis://localhost:6379';
const redis = new RedisPubsub(redisUrl);
const backend = new sharedb({ db, pubsub: redis });
const serverConnection = (exports.serverConnection = backend.connect());

const startShareDB = (exports.startShareDB = function startShareDB() {
  new WebSocket.Server({ server }).on('connection', ws => {
    backend.listen(new WebsocketJSONStream(ws));
  });

  const shareDbPort = (process.env && process.env.SHAREDBPORT) || 3002;
  server.listen(shareDbPort, err => {
    if (err) throw err;
  });
  console.log('FROG ShareDB server started on port ' + shareDbPort);
});

startShareDB();
