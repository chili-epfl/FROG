// @flow

import React from 'react';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import FROGRouter from './FROGRouter';

const socket = new ReconnectingWebSocket('ws://localhost:3002');
export const connection = new sharedbClient.Connection(socket);
window.connection = connection;

export default () =>
  <Router>
    <div>
      <Route component={FROGRouter} />
    </div>
</Router>;