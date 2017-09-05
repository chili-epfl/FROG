// @flow
/* eslint-disable prefer-arrow-func */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';

import { startShareDB } from './share-db-manager';

import '../imports/startup/shutdown-if-env.js';

import {
  Activities,
  Operators,
  Connections
} from '../imports/api/activities.js';
import { Graphs } from '../imports/api/graphs.js';
import { Sessions } from '../imports/api/sessions.js';
import { ActivityData } from '../imports/api/activityData.js';
import { Products } from '../imports/api/products.js';
import { Objects } from '../imports/api/objects.js';
import { Uploads } from '../imports/api/uploads.js';
import { OpenUploads } from '../imports/api/openUploads.js';
import UserAccounts from './user_accounts';

Meteor.publish('userData', function() {
  const user = Meteor.users.findOne(this.userId);
  const username = user && user.username;
  if (username === 'teacher') {
    return Meteor.users.find({}, { fields: { username: 1 } });
  }
  if (!username) {
    return this.ready();
  }
  return Meteor.users.find(this.userId, { fields: { username: 1 } });
});

publishComposite('session_activities', function(session) {
  return {
    find() {
      const user = Meteor.users.findOne(this.userId);
      return user && user.currentSession;
    },
    children: [
      {
        find() {
          return Sessions.find(session, {
            fields: {
              openActivities: 1,
              state: 1,
              countDownStartTime: 1,
              countdownLength: 1,
              pausedAt: 1,
              startedAt: 1
            }
          });
        },
        children: [
          {
            find(openact) {
              return Activities.find({ _id: { $in: openact } });
            }
          },
          {
            find(openact) {
              return Objects.find({ _id: { $in: openact } });
            }
          }
        ]
      }
    ]
  };
});

Meteor.publish('activities', () => Activities.find({}));
Meteor.publish('operators', () => Operators.find({}));
Meteor.publish('connections', () => Connections.find({}));
Meteor.publish('activity_data', () => ActivityData.find({}));
Meteor.publish('graphs', () => Graphs.find({}));
Meteor.publish('objects', () => Objects.find({}));
Meteor.publish('products', () => Products.find({}));
Meteor.publish('sessions', () => Sessions.find({}));
Meteor.publish('uploads', () => Uploads.find({}));
Meteor.publish('openUploads', () => OpenUploads.find({}));

startShareDB();
const checkActivity = (activityId, operators, connections) => {
  const connectedNodes = connections
    .filter(x => x.target.id === activityId)
    .map(x => x.source.id);
  const controlOp = operators.find(x => connectedNodes.includes(x._id));
  if (!controlOp) {
    return true;
  }

  const structraw = Products.findOne(controlOp._id);
  const struct = structraw && structraw.controlStructure;
  if (!struct) {
    return true;
  }

  if (struct.list && !struct.list[activityId]) {
    return true;
  }

  const cond = struct.all ? struct.all : struct.list[activityId];
  if (cond.structure === 'individual') {
    const payload = cond.payload[Meteor.userId()];
    if (!payload && cond.mode === 'include') {
      return false;
    }

    if (payload && cond.mode === 'exclude') {
      return false;
    }
    return true;
  }
};
