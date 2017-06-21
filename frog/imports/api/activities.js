// @flow

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { omitBy, isNil } from 'lodash';
import {
  uuid,
  type ObjectT,
  type structureDefT,
  type ActivityDbT
} from 'frog-utils';

import { operatorTypesObj } from '../operatorTypes';
import { Graphs } from './graphs';
import { Objects } from './objects';
import { Products } from './products';
import { Sessions } from './sessions';
import doGetInstances from './doGetInstances';

export const Activities = new Mongo.Collection('activities');
export const Operators = new Mongo.Collection('operators');
export const Connections = new Mongo.Collection('connections');
export const Results = new Mongo.Collection('results');

export const getInstances = (
  activityId: string
): { groups: string[], structure: structureDefT } => {
  const activity: ActivityDbT = Activities.findOne(activityId);
  const object: ObjectT = Objects.findOne(activityId);
  if (activity === undefined) {
    throw 'Cannot find activity';
  }
  return doGetInstances(activity, object);
};

export const addActivity = (
  activityType: string,
  data: ?Object = {},
  id: string,
  groupingKey: ?string
) => {
  if (id) {
    const toSet = omitBy({ data, groupingKey }, isNil);
    Activities.update(id, { $set: toSet });
  } else {
    Activities.insert({
      _id: uuid(),
      activityType,
      data,
      groupingKey,
      createdAt: new Date()
    });
  }
};

export const duplicateActivity = (activity: ActivityDbT) =>
  Activities.insert({
    ...activity,
    createdAt: new Date(),
    _id: uuid()
  });

export const addGraphActivity = (params: Object) =>
  Activities.insert({
    ...params,
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
      type: operatorTypesObj[operatorType].meta.type,
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
