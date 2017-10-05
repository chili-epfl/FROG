if (process.argv.length < 3) {
  console.log(
    'Tests that a sharedb server is functioning. Call with a URL, like wss:// or ws://localhost:3002'
  );

  process.exit();
}

const failed = () => console.log('WS failed');
var WebSocket = require('ws');
var ShareDB = require('sharedb/lib/client');
var socket = new WebSocket(process.argv[2]);
var connection = new ShareDB.Connection(socket);
const con = connection.get('rz', '1');
con.subscribe();
const timeout = setTimeout(failed, 5000);
con.on('load', x => {
  console.log('WS works');
  process.exit();
});
