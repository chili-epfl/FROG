const http = require('http');
const ShareDB = require('@chilifrog/sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const ShareDBMongo = require('@chilifrog/sharedb-mongo');
const richText = require('@minervaproject/rich-text');
const json0 = require('@minervaproject/ot-json0');

json0.type.registerSubtype(richText.type);
ShareDB.types.register(json0.type);

const dbUrl = 'mongodb://localhost:27017/cursors';
const db = ShareDBMongo(dbUrl);
const backend = new ShareDB(db);
createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback) {
  const connection = backend.connect();
  const doc = connection.get('examples', 'stian5');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create(
        {
          text: { ops: [{ insert: '\n' }] },
          text2: { ops: [{ insert: '\n' }] },
          example: '',
          example2: '',
          bike: false,
          car: false
        },
        'json0',
        callback
      );
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections

  const server = http.createServer();
  // Connect any incoming WebSocket connection to ShareDB
  const wss = new WebSocket.Server({ server });
  wss.on('connection', function(ws, req) {
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(9001);
  console.log('Listening on http://localhost:8080');
}
