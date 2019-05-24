// @flow

import { Meteor } from 'meteor/meteor';
import richText from '@minervaproject/rich-text';
import json0 from '@minervaproject/ot-json0';

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
  const sharedbClient = require('@chilifrog/sharedb/lib/client');

  json0.type.registerSubtype(richText.type);
  sharedbClient.types.register(json0.type);

  socket = new ReconnectingWebSocket(shareDbUrl + '?' + Meteor.userId(), null, {
    minConnectionDelay: 1
  });
  _connection = new sharedbClient.Connection(socket);

  if (
    process.env.NODE_ENV !== 'production' ||
    Meteor.settings.public.friendlyProduction
  ) {
    window.connection = _connection;
  }
}
export const connection: any = _connection;
