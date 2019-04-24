// @flow

import richText from 'rich-text';
import json0 from 'ot-json0';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import sharedbClient from 'sharedb/lib/client';

let socket;
let _connection;
const shareDbUrl = 'ws://localhost:3002';
json0.type.registerSubtype(richText.type);
sharedbClient.types.register(json0.type);

socket = new ReconnectingWebSocket(shareDbUrl, null, {
  minConnectionDelay: 1
});
_connection = new sharedbClient.Connection(socket);

export const connection: any = _connection;
