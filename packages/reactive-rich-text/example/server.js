var http = require('http');
var ShareDB = require('@chilifrog/sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var ShareDBMongo = require('@chilifrog/sharedb-mongo');
var richText = require('@minervaproject/rich-text');
var json0 = require('@minervaproject/ot-json0');

json0.type.registerSubtype(richText.type);
ShareDB.types.register(json0.type);

const dbUrl = 'mongodb://localhost:27017/cursors';
const db = ShareDBMongo(dbUrl);
var backend = new ShareDB(db);
createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'stian5');
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
  var wss = new WebSocket.Server({ server: server });
  wss.on('connection', function(ws, req) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(9001);
  console.log('Listening on http://localhost:8080');
}
