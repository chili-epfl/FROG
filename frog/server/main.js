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

startShareDB();
Meteor.users._ensureIndex('joinedSessions');

Meteor.publish('userData', function() {
  const user = Meteor.user();
  const username = user && user.username;
  if (username === 'teacher') {
    return Meteor.users.find(
      {},
      { fields: { username: 1, joinedSessions: 1 } }
    );
  }
  if (!username) {
    return this.ready();
  }
  return Meteor.users.find(this.userId, {
    fields: { username: 1, joinedSessions: 1 }
  });
});

publishComposite('student_session', function(slug) {
  return {
    find() {
      return Meteor.users.find(this.userId);
    },
    children: [
      {
        find(user) {
          if (user.joinedSessions && user.joinedSessions.includes(slug)) {
            return Sessions.find({ slug });
          } else {
            return this.ready();
          }
        }
      }
    ]
  };
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
              return Activities.find({ _id: { $in: session.openActivities } });
            }
          },
          {
            find(session) {
              return Objects.find({ _id: { $in: session.openActivities } });
            }
          }
        ]
      }
    ]
  };
});

Meteor.publish('activities', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return Activities.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('operators', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return Operators.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('connections', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return Connections.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('activity_data', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return ActivityData.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('graphs', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return Graphs.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('objects', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return Objects.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('products', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return Products.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('sessions', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return Sessions.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('uploads', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return Uploads.find({});
  } else {
    return this.ready();
  }
});
Meteor.publish('openUploads', function() {
  if (Meteor.users.findOne(this.userId).username === 'teacher') {
    return OpenUploads.find({});
  } else {
    return this.ready();
  }
});

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
