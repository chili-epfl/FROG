// @flow

import richText from '@minervaproject/rich-text';
import json0 from '@minervaproject/ot-json0';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import sharedbClient from '@chilifrog/sharedb/lib/client';

let socket;
let _connection;
const shareDbUrl = 'ws://localhost:9001';
json0.type.registerSubtype(richText.type);
sharedbClient.types.register(json0.type);

socket = new ReconnectingWebSocket(shareDbUrl, null, {
  minConnectionDelay: 1
});
_connection = new sharedbClient.Connection(socket);

export const connection: any = _connection;
