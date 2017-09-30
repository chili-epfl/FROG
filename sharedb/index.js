Object.defineProperty(exports, '__esModule', {
  value: true
});
const sharedb = require('sharedb');
const WebSocket = require('ws');
const WebsocketJSONStream = require('websocket-json-stream');
const shareDBMongo = require('sharedb-mongo');
const http = require('http');

const dbUrl =
  (process.env && process.env.FROG_MONGOURL) || 'mongodb://localhost:3001';
const db = shareDBMongo(dbUrl + '/sharedb');
console.log(db);

const server = http.createServer();
const backend = new sharedb({ db });
console.log(backend);
const serverConnection = (exports.serverConnection = backend.connect());
console.log(serverConnection);

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
