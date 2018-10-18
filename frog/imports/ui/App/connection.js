// @flow

import { Meteor } from 'meteor/meteor';
import richText from 'rich-text';
import json0 from'ot-json0';

let socket;
let _connection;
if (Meteor.isClient) {
  const shareDbUrl =
    (Meteor.settings.public && Meteor.settings.public.sharedburl) ||
    (window.location.protocol === 'https:' ? 'wss:' : 'ws:') +
      '//' +
      window.location.hostname +
      ':3002';

  const ReconnectingWebSocket = require('reconnectingwebsocket');
  const sharedbClient = require('sharedb/lib/client');

  json0.type.registerSubtype(richText.type);
  sharedbClient.types.register(json0.type);

  socket = new ReconnectingWebSocket(shareDbUrl);
  _connection = new sharedbClient.Connection(socket);

  if (
    process.env.NODE_ENV !== 'production' ||
    Meteor.settings.public.friendlyProduction
  ) {
    window.connection = _connection;
  }
}
export const connection: any = _connection;
