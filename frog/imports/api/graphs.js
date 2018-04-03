// @flow

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { omitBy, isNil } from 'lodash';
import { uuid } from 'frog-utils';

import { operatorTypesObj } from '../operatorTypes';
import { Products } from './products';
import { Sessions } from './sessions';

export const Graphs = new Mongo.Collection('graphs');

const replaceFromMatching = (matching: Object, data: any) => {
  if (Array.isArray(data)) {
    return [...data.map(d => replaceFromMatching(matching, d))];
  } else if (data && typeof data === 'object') {
    return Object.keys(data).reduce((acc, d) => {
      acc[d] = replaceFromMatching(matching, data[d]);
      return acc;
    }, {});
  } else {
    return data in matching ? matching[data] : data;
  }
};

export const addGraph = (graphObj?: Object): string => {
  const graphId = uuid();
  const name = (graphObj && graphObj.graph && graphObj.graph.name) || 'Unnamed';
  Graphs.insert({
    ...((graphObj && graphObj.graph) || {}),
    _id: graphId,
    name,
    createdAt: new Date(),
    duration: 120,
    broken: false,
    activities: [],
    operators: [],
    connections: []
  });
  if (!graphObj) {
    return graphId;
  }

  const matching = {};

  const copyAc = graphObj.activities.map(ac => {
    const id = uuid();
    matching[ac._id] = id;
    return { ...ac, _id: id, actualStartingTime: undefined };
  });

  const copyOp = graphObj.operators.map(op => {
    const id = uuid();
    matching[op._id] = id;
    return { ...op, _id: id };
  });

  // Here we change the configured ids of activities and operators which
  // have to change due to the copy
  const newConn = graphObj.connections.map(connection => {
    const id = uuid();
    matching[connection._id] = id;
    return {
      ...connection,
      _id: id,
      source: {
        id: matching[connection.source.id],
        type: connection.source.type
      },
      target: {
        id: matching[connection.target.id],
        type: connection.target.type
      }
    };
  });

  const newAc = copyAc.map(ac => ({
    ...ac,
    data: replaceFromMatching(matching, ac.data),
    streamTarget: matching[ac.streamTarget]
  }));

  const newOp = copyOp.map(op => ({
    ...op,
    data: replaceFromMatching(matching, op.data)
  }));

  const toSet = omitBy(
    { activities: newAc, operators: newOp, connections: newConn },
    isNil
  );
  Graphs.update({ _id: graphId }, { $set: toSet });

  return graphId;
};

export const importGraph = (params: Object): string => {
  const id = params._id;
  Graphs.insert({ ...params, _id: id, createdAt: new Date() });
  return id;
};

export const renameGraph = (graphId: string, name: string) =>
  Graphs.update({ _id: graphId }, { $set: { name } });

// updating graph from graph editor
export const mergeGraph = (mergeObj: Object) => {
  Meteor.call('graph.merge', mergeObj);
};

export const setCurrentGraph = (graphId: string) => {
  Meteor.users.update(Meteor.userId(), {
    $set: { 'profile.editingGraph': graphId }
  });
};

export const assignGraph = (wantedId: string) => {
  const user = Meteor.user();
  if (wantedId && Graphs.findOne({ _id: wantedId })) {
    return wantedId;
  }
  let graphId;
  // Get the graph the user is editing and check if the graph exists
  graphId = user.profile ? user.profile.editingGraph : null;
  graphId = graphId && Graphs.findOne({ _id: graphId }) ? graphId : null;
  // Assign the id of the first graph of the graph list if there is one
  const oneGraph = Graphs.findOne();
  if (!graphId) graphId = oneGraph ? oneGraph._id : null;
  // If nothing worked create new graph
  if (!graphId) graphId = addGraph();
  setCurrentGraph(graphId);
  return graphId;
};

// //////////////////////// activity part

const changeFields = (objs: any, id: string, fields: Object) => {
  const obj = objs.find(x => x.id === id);
  Object.keys(fields).forEach(x => (obj[x] = fields[x] || obj[x]));
  return [...objs.filter(x => x.id !== id), obj];
};
// Modified arguments
export const addActivity = (
  graphId: string,
  activityType: string,
  data: ?Object = {},
  id: string,
  groupingKey: ?string,
  parentId: ?string
) => {
  const acts = Graphs.findOne({ _id: graphId }).activities;
  if (id && acts.find(x => x.id === id)) {
    Graphs.update(
      { _id: graphId },
      {
        $set: {
          activities: changeFields(acts, id, {
            activityType,
            parentId,
            data,
            groupingKey
          })
        }
      }
    );
  } else {
    const act = {
      id: uuid(),
      parentId,
      activityType,
      data,
      groupingKey,
      createdAt: new Date()
    };
    Graphs.update({ _id: graphId }, { $set: { activities: [...acts, act] } });
  }
};

// Modified arguments
export const setParticipation = (
  graphId: string,
  activityId: string,
  participationMode: string
) => {
  const acts = Graphs.findOne({ _id: graphId }).activities;
  Graphs.update(
    { _id: graphId },
    {
      $set: {
        activities: changeFields(acts, activityId, { participationMode })
      }
    }
  );
};

// Modified arguments
export const setStreamTarget = (
  graphId: string,
  activityId: string,
  target: string
) => {
  const streamTarget = target === 'undefined' ? undefined : target;
  const acts = Graphs.findOne({ _id: graphId }).activities;
  Graphs.update(
    { _id: graphId },
    { $set: { activities: changeFields(acts, activityId, { streamTarget }) } }
  );
};

export const duplicateActivity = (graphId: string, actId: string) => {
  const acts = Graphs.findOne({ _id: graphId }).activities;
  const activity = acts.find(x => x.id === actId);
  const newAct = {
    ...activity,
    createdAt: new Date(),
    id: uuid()
  };
  Graphs.update({ _id: graphId }, { $set: { activities: [...acts, newAct] } });
  return newAct;
};

// ///////////////// operator part

export const removeGraph = (graphId: string) =>
  Meteor.call('graph.flush.all', graphId);

export const deleteDatabase = () => Meteor.call('graph.flush.db');

export const addOperator = (
  graphId: string,
  operatorType: string,
  data: Object = {},
  id: ?string
) => {
  const ops = Graphs.findOne({ _id: graphId }).operators;
  const type = operatorTypesObj[operatorType].type;
  if (id && ops.find(x => x.id === id)) {
    Graphs.update(
      { _id: graphId },
      {
        $set: { operators: changeFields(ops, id, { type, operatorType, data }) }
      }
    );
  } else {
    const op = {
      id: uuid(),
      operatorType,
      type,
      data,
      createdAt: new Date()
    };
    Graphs.update({ _id: graphId }, { $set: { operators: [...ops, op] } });
  }
};

// Meteor methods

Meteor.methods({
  'graph.merge': ({
    connections,
    activities,
    operators,
    graphId,
    graphDuration
  }) => {
    if (Graphs.findOne({ _id: graphId }))
      Graphs.update(
        { _id: graphId },
        {
          $set: { duration: graphDuration, activities, operators, connections }
        }
      );
  },
  // Modifdied arguments
  'get.activity.for.dashboard': (graphId, id) => {
    if (Meteor.isServer) {
      const graph = Graphs.findOne({ _id: graphId });
      const activity = graph.activities.findOne(id);
      const users = Meteor.users
        .find({ slug: graph.slug }, { fields: { username: 1 } })
        .fetch();
      return { activity, users };
    }
  },
  'graph.flush.all': graphId => {
    Graphs.remove({ _id: graphId });
    Sessions.remove({ graphId });
  },
  'graph.flush.db': () => {
    Graphs.remove({});
    Sessions.remove({});
    Products.remove({});
  }
});
