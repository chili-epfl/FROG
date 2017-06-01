import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';
import ShareDBMongo from 'sharedb-mongo';

const db = ShareDBMongo('mongodb://localhost:3001/sharedb');

const server = http.createServer();
const backend = new ShareDB({ db });
new WebSocket.Server({ server: server }).on('connection', function(ws) {
  backend.listen(new WebsocketJSONStream(ws));
  console.log('New socket client on CollabMeteor instance');
});

server.listen(3002, function(err) {
  if (err) throw err;
  console.log('ShareDB: Server Listening on port 3002');
});
