/* eslint-disable */
if (process.argv.length < 3) {
  console.log(
    'Tests that a sharedb server is functioning. Call with a URL, like wss:// or ws://localhost:3002'
  );

  process.exit();
}

const failed = () => console.log('WS failed');
const WebSocket = require('ws');
const ShareDB = require('sharedb/lib/client');

const socket = new WebSocket(process.argv[2]);
const connection = new ShareDB.Connection(socket);
const con = connection.get('rz', '1');
con.subscribe();
const timeout = setTimeout(failed, 5000);
con.on('load', x => {
  console.log('WS works');
  process.exit();
});
