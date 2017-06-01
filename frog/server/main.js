// @flow

import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';

import { startShareDB } from './share-db-manager';

import '../imports/startup/shutdown-if-env.js';

import '../imports/api/messages.js';
import '../imports/api/activities.js';
import '../imports/api/graphs.js';
import '../imports/api/sessions.js';
import '../imports/api/logs.js';
import '../imports/api/activityData.js';
import '../imports/api/products.js';
import '../imports/api/objects.js';
import '../imports/api/global.js';
import '../imports/api/engine.js';

Meteor.publish('userData', () => Meteor.users.find({}));

startShareDB();
