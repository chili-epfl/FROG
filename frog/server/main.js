// @flow
/* eslint-disable prefer-arrow-func */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import process from 'process';

import { startShareDB } from './share-db-manager';
import '../imports/startup/shutdown-if-env.js';

import teacherImports from './teacherImports';
import {
  Activities,
  Operators,
  Connections
} from '../imports/api/activities.js';
import { Sessions } from '../imports/api/sessions.js';
import { Products } from '../imports/api/products.js';
import { Objects } from '../imports/api/objects.js';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('longjohn');
}

process.setMaxListeners(100);
Meteor.users._ensureIndex('joinedSessions');
startShareDB();
teacherImports();

Meteor.publish('userData', function() {
  const user = Meteor.user();
  const username = user && user.username;
  if (!username) {
    return this.ready();
  }
  return Meteor.users.find(this.userId, {
    fields: { username: 1, joinedSessions: 1 }
  });
});

publishComposite('session_activities', function(slug) {
  return {
    find() {
      return Meteor.users.find(this.userId);
    },
    children: [
      {
        find(user) {
          if (user.joinedSessions && user.joinedSessions.includes(slug)) {
            return Sessions.find({ slug });
          }
        },
        children: [
          {
            find(session) {
              const operators = Operators.find({
                graphId: session.graphId
              }).fetch();
              const connections = Connections.find({
                graphId: session.graphId
              }).fetch();
              return Activities.find({
                _id: {
                  $in: session.openActivities.filter(x =>
                    checkActivity(x, operators, connections, this.userId)
                  )
                }
              });
            },
            children: [
              {
                find(activity) {
                  return Objects.find(activity._id);
                }
              }
            ]
          }
        ]
      }
    ]
  };
});

const checkActivity = (activityId, operators, connections, userid) => {
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
    const payload = cond.payload[userid];
    if (!payload && cond.mode === 'include') {
      return false;
    }

    if (payload && cond.mode === 'exclude') {
      return false;
    }
    return true;
  }
};
