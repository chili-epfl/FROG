import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';

import { operatorTypesObj } from '../operatorTypes';
import { Graphs } from './graphs';
import { Products } from './products';
import { Sessions } from './sessions';

export const Activities = new Mongo.Collection('activities');
export const Operators = new Mongo.Collection('operators');
export const Connections = new Mongo.Collection('connections');
export const Results = new Mongo.Collection('results');

export const addActivity = (activityType, data, id) => {
  if (id) {
    Activities.update(id, { $set: { data } });
  } else {
    Activities.insert({
      _id: uuid(),
      activityType,
      data,
      createdAt: new Date()
    });
  }
};

export const duplicateActivity = activity =>
  Activities.insert({
    ...activity,
    _id: uuid(),
    data: { ...activity.data, name: activity.data.name + ' (copy)' }
  });

export const addGraphActivity = params =>
  Activities.insert({
    ...params,
    graphId: params.graphId,
    createdAt: new Date(),
    _id: uuid()
  });

export const importActivity = params =>
  Activities.insert({ ...params, createdAt: new Date(), _id: params._id });

export const importGraphActivity = (params, thisGraphId) =>
  Activities.insert({
    ...params,
    graphId: thisGraphId,
    createdAt: new Date(),
    _id: params._id
  });

export const removeGraphActivity = activityId =>
  Meteor.call('graph.flush.activity', activityId);

export const addGraphOperator = params =>
  Operators.insert({
    ...params,
    graphId: params.graphId,
    createdAt: new Date(),
    _id: uuid()
  });

export const importOperator = params =>
  Operators.insert({ ...params, createdAt: new Date(), _id: params._id });

export const importConnection = params =>
  Connections.insert({ ...params, createdAt: new Date(), _id: params._id });

export const importGraphOperator = (params, thisGraphId) =>
  Operators.insert({
    ...params,
    graphId: thisGraphId,
    createdAt: new Date(),
    _id: params._id
  });

export const copyActivityIntoGraphActivity = (
  graphActivityId,
  fromActivityId
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
  graphOperatorId,
  fromOperatorId
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

export const removeGraph = graphId => Meteor.call('graph.flush.all', graphId);

export const deleteDatabase = () => Meteor.call('graph.flush.db');

export const dragGraphActivity = (id, xPosition) => {
  Activities.update(id, { $inc: { xPosition } });
};

export const addOperator = (operatorType, data, id) => {
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

export const addResult = (type, activityId, result) => {
  Results.update(
    { _id: activityId + type },
    { $set: { type, activityId, result, createdAt: new Date() } },
    { upsert: true }
  );
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
    Sessions.remove({ copyGraphId: graphId });
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
