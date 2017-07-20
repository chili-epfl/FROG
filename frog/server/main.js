// @flow

import { Meteor } from 'meteor/meteor';

import { startShareDB } from './share-db-manager';

import '../imports/startup/shutdown-if-env.js';

import { Messages } from '../imports/api/messages.js';
import {
  Activities,
  Operators,
  Connections
} from '../imports/api/activities.js';
import { Graphs } from '../imports/api/graphs.js';
import { Sessions } from '../imports/api/sessions.js';
import { Logs } from '../imports/api/logs.js';
import { ActivityData } from '../imports/api/activityData.js';
import { Products } from '../imports/api/products.js';
import { Objects } from '../imports/api/objects.js';
import { GlobalSettings } from '../imports/api/global.js';
import { Uploads } from '../imports/api/uploads.js';
// import '../imports/api/engine.js';

Meteor.publish('userData', () => Meteor.users.find({}));
Meteor.publish('activities', () => Activities.find({}));
Meteor.publish('operators', () => Operators.find({}));
Meteor.publish('connections', () => Connections.find({}));
Meteor.publish('activity_data', () => ActivityData.find({}));
Meteor.publish('global_settings', () => GlobalSettings.find({}));
Meteor.publish('graphs', () => Graphs.find({}));
Meteor.publish('logs', () => Logs.find({}));
Meteor.publish('messages', () => Messages.find({})); // unused ???
Meteor.publish('objects', () => Objects.find({}));
Meteor.publish('products', () => Products.find({}));
Meteor.publish('sessions', () => Sessions.find({}));
Meteor.publish('uploads', () => Uploads.find({}));

startShareDB();
