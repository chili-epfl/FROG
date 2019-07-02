// @flow
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { omitBy, isNil } from 'lodash';
import { chainUpgrades, uuid } from 'frog-utils';

import { activityTypesObj } from '/imports/activityTypes';
import { Activities, Connections } from '/imports/collections';

const extractUpgradedActivityConfig = (activity: Object) => ({
  ...activity,
  data: activityTypesObj[activity.activityType].upgradeFunctions
    ? chainUpgrades(
        activityTypesObj[activity.activityType].upgradeFunctions,
        activity.configVersion === undefined ? 1 : activity.configVersion,
        activityTypesObj[activity.activityType].configVersion
      )(activity.data)
    : activity.data,
  configVersion: activityTypesObj[activity.activityType].configVersion
});

export const insertActivityMongo = (activity: Object) => {
  try {
    Activities.insert(
      activity.activityType ? extractUpgradedActivityConfig(activity) : activity
    );
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

export const storeTemplateData = (id: string, data: Object) => {
  return Activities.update(id, { $set: { template: data } });
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
        extractUpgradedActivityConfig(update),
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
    .map(x =>
      x.activityType && activityTypesObj[x.activityType]
        ? extractUpgradedActivityConfig(x)
        : x
    );

export const findOneActivityMongo = (id: string) => {
  // add try catch
  const activity = Activities.findOne(id);
  return activity.activityType && activityTypesObj[activity.activityType]
    ? extractUpgradedActivityConfig(activity)
    : activity;
};

export const addActivity = (
  activityType?: string,
  data: ?Object = {},
  id?: string,
  configVersion: ?number,
  groupingKey: ?string,
  parentId: ?string
) => {
  const actId = id || uuid();
  if (id)
    updateOneActivityMongo(id, {
      $set: omitBy(
        {
          activityType,
          parentId,
          data,
          groupingKey,
          ...(activityType
            ? {
                configVersion:
                  configVersion || activityTypesObj[activityType].configVersion
              }
            : {})
        },
        isNil
      )
    });
  else
    insertActivityMongo({
      _id: actId,
      parentId,
      ...(activityType
        ? {
            configVersion:
              configVersion || activityTypesObj[activityType].configVersion
          }
        : {}),
      activityType,
      data,
      groupingKey,
      createdAt: new Date()
    });
  return actId;
};

export const removeActivityType = (id: string) => {
  Activities.update(id, {
    $unset: {
      template: null,
      templateRZCloned: null,
      activityType: null,
      data: null,
      configVersion: null
    }
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
  const activity = Activities.findOne(actId);
  const newAct = {
    ...activity,
    createdAt: new Date(),
    _id: uuid()
  };
  Activities.insert(newAct);
  return newAct;
};

export const importConnection = (params: Object) =>
  Connections.insert({ ...params, createdAt: new Date(), _id: params._id });

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
