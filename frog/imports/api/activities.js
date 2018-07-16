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

import { activityTypesObj } from '/imports/activityTypes';

export const Activities = new Mongo.Collection('activities');
export const Connections = new Mongo.Collection('connections');
export const DashboardData: MongoT<DashboardDataDbT> = new Mongo.Collection(
  'dashboard_data'
);

export const insertActivityMongo = (activity: Object) => {
  try {
    const newAct = {
      ...activity,
      data: activityTypesObj[activity.activityType].upgradeFunctions
        ? chainUpgrades(
            activityTypesObj[activity.activityType].upgradeFunctions,
            activity.configVersion === undefined ? 1 : activity.configVersion,
            activityTypesObj[activity.activityType].configVersion
          )(activity.data)
        : activity.data,
      configVersion: activityTypesObj[activity.activityType].configVersion
    };
    Activities.insert(newAct);
  } catch (e) {
    console.warn(e);
    // eslint-disable-next-line no-alert
    window.alert(
      'Format  error: unable to upgrade the configuration of the activity: ' +
        activity.title +
        '-> configuration removed'
    );
    Activities.insert({ ...activity, data: {} });
  }
};

export const updateOneActivityMongo = (
  id: string,
  update: Object,
  options?: Object
) => {
  if (update.config)
    try {
      return Activities.update(
        id,
        {
          ...update,
          data: activityTypesObj[update.activityType].upgradeFunctions
            ? chainUpgrades(
                activityTypesObj[update.activityType].upgradeFunctions,
                update.configVersion === undefined ? 1 : update.configVersion,
                activityTypesObj[update.activityType].configVersion
              )(update.config)
            : update.config,
          configVersion: activityTypesObj[update.activityType].configVersion
        },
        options
      );
    } catch (e) {
      console.warn(e);
      // eslint-disable-next-line no-alert
      window.alert(
        'Format  error: unable to upgrade the configuration of the activity -> configuration removed'
      );
      return Activities.update(id, { ...update, data: {} }, options);
    }
  else return Activities.update(id, update, options);
};

export const findActivitiesMongo = (query: Object, proj?: Object) =>
  Activities.find(query, proj)
    .fetch()
    .map(
      x =>
        x.activityType && activityTypesObj[x.activityType].upgradeFunctions
          ? {
              ...x,
              data: chainUpgrades(
                activityTypesObj[x.activityType].upgradeFunctions,
                x.configVersion === undefined ? 1 : x.configVersion,
                activityTypesObj[x.activityType].configVersion
              )(x.data),
              configVersion: activityTypesObj[x.activityType].configVersion
            }
          : x
    );

export const findOneActivityMongo = (id: string) => {
  // add try catch
  const activity = Activities.findOne(id);
  return activity.activityType &&
    activityTypesObj[activity.activityType].upgradeFunctions
    ? {
        ...activity,
        data: chainUpgrades(
          activityTypesObj[activity.activityType].upgradeFunctions,
          activity.configVersion === undefined ? 1 : activity.configVersion,
          activityTypesObj[activity.activityType].configVersion
        )(activity.data),
        configVersion: activityTypesObj[activity.activityType].configVersion
      }
    : activity;
};

export const addActivity = (
  activityType?: string,
  data: ?Object = {},
  id: string,
  configVersion: ?number,
  groupingKey: ?string,
  parentId: ?string
) =>
  id
    ? updateOneActivityMongo(id, {
        $set: omitBy(
          { activityType, parentId, data, groupingKey, configVersion },
          isNil
        )
      })
    : insertActivityMongo({
        _id: uuid(),
        parentId,
        configVersion,
        activityType,
        data,
        groupingKey,
        createdAt: new Date()
      });

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
  insertActivityMongo(newAct);
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
