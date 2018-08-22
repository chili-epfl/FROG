// @flow
/* eslint-disable prefer-arrow-func */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { uuid } from 'frog-utils';

import { startShareDB } from './share-db-manager';
import '../imports/startup/shutdown-if-env.js';

import { Logs } from '../imports/api/logs';
import teacherImports from './teacherImports';
import {
  Activities,
  findActivitiesMongo,
  Connections,
  DashboardData
} from '../imports/api/activities.js';
import { upgradeGraphMongo } from '../imports/api/graphs.js';
import { Operators, findOperatorsMongo } from '../imports/api/operators.js';
import { Sessions } from '../imports/api/sessions.js';
import { Products } from '../imports/api/products.js';
import { Objects } from '../imports/api/objects.js';
import { GlobalSettings } from '../imports/api/globalSettings.js';
import dashboardSubscription from './dashboardSubscription';
import './getLogMethods';
import { activityTypesObj } from '../imports/activityTypes';
import initExternalOperators from './externalOperators';

console.info('Meteor settings', Meteor.settings);

dashboardSubscription();
initExternalOperators();

Meteor.users._ensureIndex('joinedSessions');
Meteor.users._ensureIndex('services.frog.id');
Logs._ensureIndex('sessionId');
Sessions._ensureIndex('slug');
Operators._ensureIndex('graphId');
Operators._ensureIndex('type');
Activities._ensureIndex('graphId');
Activities._ensureIndex('type');
Connections._ensureIndex('graphId');
Connections._ensureIndex('target.id');
Connections._ensureIndex('source.id');
startShareDB();
teacherImports();

// upgrade graphs, activities and operators if code has changed
upgradeGraphMongo({});

findActivitiesMongo({})
  .filter(x => x.activityType)
  .forEach(x =>
    Activities.update(x._id, {
      $set: { data: x.data, configVersion: x.configVersion }
    })
  );
findOperatorsMongo({})
  .filter(x => x.operatorType)
  .forEach(x =>
    Operators.update(x._id, {
      $set: { data: x.data, configVersion: x.configVersion }
    })
  );

if (
  process.env.NODE_ENV === 'production' &&
  !Meteor.settings.public.friendlyProduction
) {
  if (!Meteor.settings.token) {
    Meteor.settings.token = uuid();
  }
  console.info('Meteor login token ', Meteor.settings.token);
  GlobalSettings.update(
    'token',
    { value: Meteor.settings.token },
    { upsert: true }
  );
}

Meteor.publish('globalSettings', function() {
  return GlobalSettings.find({});
});

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

Meteor.publish('dashboard.data', function(sessionId, activityId, names) {
  if (!sessionId) return;
  const slug = Sessions.findOne(sessionId).slug;
  if (!slug) return;
  const act = Activities.findOne(activityId);
  if (!act) return;
  const aT = activityTypesObj[act.activityType];
  const dashNames = (
    (!names || names === 'all'
      ? aT.dashboards && Object.keys(aT.dashboards)
      : names) || []
  ).map(x => activityId + '-' + x);
  const dashData = DashboardData.find({ dashId: { $in: dashNames } });

  const users = Meteor.users.find(
    { joinedSessions: slug },
    { fields: { username: 1, joinedSessions: 1, role: 1 } }
  );
  const object = Objects.find(activityId);
  return [users, object, dashData];
});

publishComposite('session_activities', function(slug) {
  return {
    find() {
      return Meteor.users.find(this.userId, {
        fields: { joinedSessions: 1, username: 1 }
      });
    },
    children: [
      {
        find(user) {
          if (user.joinedSessions && user.joinedSessions.includes(slug)) {
            return Sessions.find(
              { slug },
              { sort: { startedAt: -1 }, limit: 1 }
            );
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
                    checkActivity(
                      session,
                      x,
                      operators,
                      connections,
                      this.userId
                    )
                  )
                }
              });
            },
            children: [
              {
                find(activity) {
                  return Objects.find(activity._id, {
                    fields: { socialStructure: 1, activityData: 1 }
                  });
                }
              }
            ]
          }
        ]
      }
    ]
  };
});

const checkActivity = (session, activityId, operators, connections, userid) => {
  const act = Activities.findOne(activityId);
  const isTeacher = session.ownerId === userid;

  if (isTeacher && ![3, 4].includes(act.plane)) {
    return false;
  }
  if (
    ((act.plane === 3 && act.participationMode === 'projector') ||
      act.plane === 4) &&
    !isTeacher
  ) {
    return false;
  }

  const connectedNodes = connections
    .filter(x => x.target.id === activityId)
    .map(x => x.source.id);

  const controlOp = operators.find(
    x => connectedNodes.includes(x._id) && x.type === 'control'
  );
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
