// @flow
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { omitBy, isNil } from 'lodash';
import {
  chainUpgrades,
  uuid,
  type MongoT,
  type DashboardDataDbT
} from 'frog-utils';

import { activityTypesObj } from '/imports/activityTypes'; // to access upgrFun

export const Activities = new Mongo.Collection('activities');
export const Connections = new Mongo.Collection('connections');
export const DashboardData: MongoT<DashboardDataDbT> = new Mongo.Collection(
  'dashboard_data'
);

export const insertActivityToMongo = (activity: Object) => {
  try {
    const newAct = {
      ...activity,
      data: activityTypesObj[activity.activityType].upgradeFunctions
        ? chainUpgrades(
            activityTypesObj[activity.activityType].upgradeFunctions,
            activity.configVersion || 1,
            activityTypesObj[activity.activityType].configVersion
          )(activity.data)
        : activity.data,
      configVersion: activityTypesObj[activity.activityType].configVersion
    };
    Activities.insert(newAct);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
    // eslint-disable-next-line no-alert
    window.alert(
      'Format  error: unable to upgrade the configuration of the activity: ' +
        activity.title
    );
  }
};
export const updateActivityToMongo = (id: string, activity: Object) =>
  Activities.update(id, activity);
export const findActivitiesMongo = (filter: Object) =>
  Activities.find(filter).fetch();
export const findOneActivityMongo = (id: string) => Activities.findOne(id);

export const addActivity = (
  activityType?: string,
  data: ?Object = {},
  id: string,
  groupingKey: ?string,
  parentId: ?string
) => {
  const configVersion =
    activityType && activityTypesObj[activityType].configVersion;
  if (id) {
    const toSet = omitBy(
      { activityType, parentId, data, groupingKey, configVersion },
      isNil
    );
    Activities.update(id, { $set: toSet });
  } else {
    insertActivityToMongo({
      _id: uuid(),
      parentId,
      configVersion,
      activityType,
      data,
      groupingKey,
      createdAt: new Date()
    });
  }
};

export const removeActivityType = (id: string) => {
  Activities.update(id, {
    $unset: { activityType: null, data: null, configVersion: null }
  });
};

export const setParticipation = (
  activityId: string,
  participationMode: string
) => {
  Activities.update(activityId, { $set: { participationMode } });
};

export const setStreamTarget = (activityId: string, streamTarget: string) => {
  const operation = streamTarget ? '$set' : '$unset';
  Activities.update(activityId, { [operation]: { streamTarget } });
};

export const duplicateActivity = (actId: string) => {
  // should update the old activity ?
  const activity = Activities.findOne(actId);
  const newAct = {
    ...activity,
    createdAt: new Date(),
    _id: uuid()
  };
  insertActivityToMongo(newAct);
  return newAct;
};

export const importConnection = (params: Object) =>
  Connections.insert({ ...params, createdAt: new Date(), _id: params._id });

export const copyActivityIntoGraphActivity = (
  graphActivityId: string,
  fromActivityId: string
) => {
  const fromActivity = Activities.findOne(fromActivityId);
  Activities.update(graphActivityId, {
    $set: {
      data: fromActivity.data,
      activityType: fromActivity.activityType,
      parentId: fromActivityId
    }
  });
};

export const flushActivities = () => Meteor.call('activities.flush');

Meteor.methods({
  'activities.flush': () => {
    Activities.remove({});
  },
  'get.activity.for.dashboard': id => {
    if (Meteor.isServer) {
      const activity = Activities.findOne(id);
      return { activity };
    }
  }
});
