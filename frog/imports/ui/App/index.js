// @flow

import { Meteor } from 'meteor/meteor';
import React from 'react';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import FROGRouter from './FROGRouter';

const shareDbUrl =
  (Meteor.settings && Meteor.settings.public.sharedburl) ||
  'ws://localhost:3002';
const socket = new ReconnectingWebSocket(shareDbUrl);
export const connection = new sharedbClient.Connection(socket);
window.connection = connection;

export default () =>
  <Router>
    <div style={{ width: '100%', height: '100%' }}>
      <Route component={FROGRouter} />
    </div>
  </Router>;
