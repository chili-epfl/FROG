// @flow

import { Meteor } from 'meteor/meteor';

let socket;
let _connection;
if (Meteor.isClient) {
  const shareDbUrl =
    (Meteor.settings.public && Meteor.settings.public.sharedburl) ||
    (window.location.protocol === 'https:' ? 'wss:' : 'ws:') +
      '//' +
      window.location.hostname +
      ':3010';

  const ReconnectingWebSocket = require('reconnectingwebsocket');
  const sharedbClient = require('sharedb/lib/client');

  socket = new ReconnectingWebSocket(shareDbUrl);
  _connection = new sharedbClient.Connection(socket);

  if (
    process.env.NODE_ENV !== 'production' ||
    Meteor.settings.public.friendlyProduction
  ) {
    window.connection = _connection;
  }
}
export const connection = _connection;
