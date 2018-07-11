// @flow
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { omitBy, isNil } from 'lodash';
import { uuid, type MongoT, type DashboardDataDbT } from 'frog-utils';

import { activityTypesObj } from '/imports/activityTypes'; // to access upgrFun

import { operatorTypesObj } from '../operatorTypes';
import { Graphs } from './graphs';
import { Products } from './products';
import { Sessions } from './sessions';

export const Activities = new Mongo.Collection('activities');
export const Operators = new Mongo.Collection('operators');
export const Connections = new Mongo.Collection('connections');
export const ExternalOperators = new Mongo.Collection('external_operators');
export const DashboardData: MongoT<DashboardDataDbT> = new Mongo.Collection(
  'dashboard_data'
);

export const addActivityToMongo = (activity: Object) => Activities.insert(activity)
export const updateActivityToMongo = (id: string, activity: Object) => Activities.update(id, activity)
export const collectActivitiesMongo = (filter: Object) => Activities.find(filter).fetch()
export const collectOneActivityMongo = (id: string) => Activities.findOne(id)

export const addActivity = (
  activityType?: string,
  data: ?Object = {},
  id: string,
  groupingKey: ?string,
  parentId: ?string,
) => {
  const configVersion = activityTypesObj[activityType].configVersion
  if (id) {
    const toSet = omitBy({ activityType, parentId, data, groupingKey, configVersion }, isNil);
    Activities.update(id, { $set: toSet });
  } else {
    Activities.insert({
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
  Activities.update(id, { $unset: { activityType: null, data: null, configVersion: null } });
};

export const removeOperatorType = (id: string) => {
  Operators.update(id, { $unset: { operatorType: null, data: null, configVersion: null } });
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

export const duplicateActivity = (actId: string) => { // should update the old activity ?
  const activity = Activities.findOne(actId);
  const newAct = {
    ...activity,
    createdAt: new Date(),
    _id: uuid()
  };
  Activities.insert(newAct);
  return newAct;
};

export const addGraphActivity = (params: Object) =>
  Activities.insert({
    ...params,
    // configVersion: activityTypesObj[params.activityType].configVersion,
    createdAt: new Date(),
    _id: uuid()
  });

export const importActivity = (params: Object) =>
  Activities.insert({ ...params, createdAt: new Date(), _id: params._id });

export const importGraphActivity = (params: Object, thisGraphId: string) =>
  Activities.insert({
    ...params,
    graphId: thisGraphId,
    createdAt: new Date(),
    _id: params._id
  });

export const removeGraphActivity = (activityId: string) =>
  Meteor.call('graph.flush.activity', activityId);

export const addGraphOperator = (params: Object) =>
  Operators.insert({
    ...params,
    createdAt: new Date(),
    _id: uuid()
  });

export const importOperator = (params: Object) =>
  Operators.insert({ ...params, createdAt: new Date(), _id: params._id });

export const importConnection = (params: Object) =>
  Connections.insert({ ...params, createdAt: new Date(), _id: params._id });

export const importGraphOperator = (params: Object, thisGraphId: string) =>
  Operators.insert({
    ...params,
    graphId: thisGraphId,
    createdAt: new Date(),
    _id: params._id
  });

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

export const copyOperatorIntoGraphOperator = (
  graphOperatorId: string,
  fromOperatorId: string
) => {
  const fromOperator = Operators.findOne(fromOperatorId);
  Operators.update(graphOperatorId, {
    $set: {
      data: fromOperator.data,
      operatorType: fromOperator.operatorType,
      type: fromOperator.type
    }
  });
};

export const removeGraph = (graphId: string) =>
  Meteor.call('graph.flush.all', graphId);

export const deleteDatabase = () => Meteor.call('graph.flush.db');

export const addOperator = (
  operatorType: string,
  data: Object = {},
  id: ?string
) => {
  if (id) {
    Operators.update(id, { $set: { data } });
  } else {
    Operators.insert({
      _id: uuid(),
      operatorType,
      type: operatorTypesObj[operatorType].type,
      data,
      createdAt: new Date()
    });
  }
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
  },
  'graph.flush.all': graphId => {
    Graphs.remove(graphId);
    Activities.remove({ graphId });
    Operators.remove({ graphId });
    Connections.remove({ graphId });
    Sessions.remove({ graphId });
  },
  'graph.flush.db': () => {
    Graphs.remove({});
    Activities.remove({});
    Operators.remove({});
    Sessions.remove({});
    Connections.remove({});
    Products.remove({});
  },
  'graph.flush.activity': activityId => {
    Operators.remove({ from: activityId });
    Operators.remove({ to: activityId });
    Activities.remove(activityId);
  }
});
