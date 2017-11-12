// @flow

import { Meteor } from 'meteor/meteor';
import traverse from 'traverse';
import { Mongo } from 'meteor/mongo';
import { uuid, calculateSchema } from 'frog-utils';
import { get, set } from 'lodash';

import { Activities, Connections, Operators } from './activities';
import { operatorTypesObj } from '../operatorTypes';

export const Graphs = new Mongo.Collection('graphs');

export const addGraph = (graphObj?: Object): string => {
  const graphId = uuid();
  const name = (graphObj && graphObj.graph && graphObj.graph.name) || 'Unnamed';
  if (!graphObj) {
    Graphs.insert({
      _id: graphId,
      name,
      createdAt: new Date()
    });
    return graphId;
  }

  const matching = {};

  const newAct = graphObj.activities
    .map(activity => {
      const id = uuid();
      matching[activity._id] = id;
      return { ...activity, _id: id, graphId };
    })
    .map(ac => ({ ...ac, streamTarget: matching[ac.streamTarget] }));

  const newOp = graphObj.operators.map(op => {
    const id = uuid();
    matching[op._id] = id;

    if (op.data) {
      const opT = operatorTypesObj[op.operatorType];
      const schema = calculateSchema(op.data, opT.config, opT.configUI);
      const paths = traverse.paths(schema).filter(x => x.pop() === 'type');
      const activityPaths = paths.filter(
        x => get(schema, [...x, 'type']) === 'activity'
      );

      activityPaths.forEach(p => {
        const path = p.filter(y => y !== 'properties');
        if (path[1] === 'items') {
          op.data[path[0]].forEach((_, i) => {
            const relpath = [path[0], i, path[2]];
            const curRef = get(op.data, relpath);
            set(op.data, relpath, matching[curRef]);
          });
        } else {
          const curRef = get(op.data, path);
          if (curRef) {
            set(op.data, path, matching[curRef]);
          }
        }
      });
    }
    return { ...op, _id: id, graphId };
  });

  const newConn = graphObj.connections.map(connection => {
    const id = uuid();
    matching[connection._id] = id;
    return {
      ...connection,
      _id: id,
      graphId,
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

  newAct.forEach(x => Activities.insert(x));
  newOp.forEach(x => Operators.insert(x));
  newConn.forEach(x => Connections.insert(x));

  Graphs.insert({
    ...((graphObj && graphObj.graph) || {}),
    _id: graphId,
    name,
    createdAt: new Date()
  });

  return graphId;
};

export const importGraph = (params: Object): string => {
  const id = params._id;
  Graphs.insert({ ...params, _id: id, createdAt: new Date() });
  return id;
};

export const renameGraph = (graphId: string, name: string) =>
  Graphs.update(graphId, { $set: { name } });

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
  if (wantedId && Graphs.findOne(wantedId)) {
    return wantedId;
  }
  let graphId;
  // Get the graph the user is editing and check if the graph exists
  graphId = user.profile ? user.profile.editingGraph : null;
  graphId = graphId && Graphs.findOne(graphId) ? graphId : null;
  // Assign the id of the first graph of the graph list if there is one
  const oneGraph = Graphs.findOne();
  if (!graphId) graphId = oneGraph ? oneGraph._id : null;
  // If nothing worked create new graph
  if (!graphId) graphId = addGraph();
  setCurrentGraph(graphId);
  return graphId;
};

Meteor.methods({
  'graph.merge': ({
    connections,
    activities,
    operators,
    graphId,
    graphDuration
  }) => {
    if (Graphs.findOne(graphId)) {
      Graphs.update(graphId, { $set: { duration: graphDuration } });

      activities.map(({ _id, ...rest }) =>
        Activities.update(_id, { $set: rest }, { upsert: true })
      );

      const actid = activities.map(x => x._id);
      Activities.remove({ _id: { $nin: actid }, graphId });

      operators.map(({ _id, ...rest }) =>
        Operators.update(_id, { $set: rest }, { upsert: true })
      );
      const optid = operators.map(x => x._id);
      Operators.remove({ _id: { $nin: optid }, graphId });

      connections.map(({ _id, ...rest }) =>
        Connections.update(_id, { $set: rest }, { upsert: true })
      );
      const conid = connections.map(x => x._id);
      Connections.remove({ _id: { $nin: conid }, graphId });
    }
  }
});
