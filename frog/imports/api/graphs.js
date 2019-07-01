// @flow

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid, chainUpgrades } from 'frog-utils';

import { Sessions, addSessionFn } from './sessions';
import { runNextActivity } from './engine';
import {
  Activities,
  Connections,
  insertActivityMongo,
  addActivity
} from './activities';
import { Operators, insertOperatorMongo } from './operators';
import {
  GraphCurrentVersion,
  GraphIdUpgrades,
  GraphObjUpgrades
} from './versionUpgrades';

export const Graphs = new Mongo.Collection('graphs');

export const createSessionFromActivity = (
  activityType: string,
  config: Object,
  plane: number = 3
): {
  slug: string,
  sessionId: string,
  graphId: string,
  activityId: string
} | void => {
  if (Meteor.isServer) {
    const graphId = addGraph();
    const activityId = addActivity(activityType, config);
    Activities.update(activityId, {
      $set: {
        graphId,
        plane,
        length: 5,
        startTime: 5,
        title: 'Single activity'
      }
    });
    const sessionId = addSessionFn(graphId);
    const session = Sessions.findOne(sessionId);
    Sessions.update(session._id, { $set: { singleActivity: true } });
    runNextActivity(session._id);

    const slug = session.slug;
    return { slug, sessionId, graphId, activityId };
  }
};

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

export const upgradeGraph = (graphObj: Object) => ({
  ...graphObj.graph,
  ...chainUpgrades(
    GraphObjUpgrades,
    graphObj.graph.graphVersion === undefined ? 1 : graphObj.graph.graphVersion,
    GraphCurrentVersion
  )(graphObj)
});

export const insertGraphMongo = (graph: Object) =>
  Graphs.insert({ ...graph, graphVersion: GraphCurrentVersion });

export const upgradeGraphMongo = (query: Object, proj?: Object) => {
  Graphs.find(query, proj)
    .fetch()
    .forEach(x => {
      try {
        chainUpgrades(
          GraphIdUpgrades,
          x.graphVersion || 1,
          GraphCurrentVersion
        )({
          graphId: x._id
        });
      } catch (e) {
        console.warn(e);
      }
    });
};

export const findOneGraphMongo = (id: string) => {
  const graph = Graphs.findOne(id);
  try {
    chainUpgrades(
      GraphIdUpgrades,
      graph.graphVersion === undefined ? 1 : graph.graphVersion,
      GraphCurrentVersion
    )({
      graphId: id
    });
    return Graphs.findOne(id);
  } catch (e) {
    console.warn(e);
    // eslint-disable-next-line no-alert
    window.alert('Upgrade error: unable to upgrade the graph');
    return graph;
  }
};

export const addGraph = (graphObj?: Object): string => {
  const graphObjTmp = graphObj && graphObj.graph && upgradeGraph(graphObj);
  const graphId = uuid();
  const name =
    (graphObjTmp && graphObjTmp.graph && graphObjTmp.graph.name) || 'Unnamed';
  insertGraphMongo({
    ...((graphObjTmp && graphObjTmp.graph) || {}),
    _id: graphId,
    name,
    ownerId: Meteor.userId(),
    createdAt: new Date()
  });
  if (!graphObjTmp) {
    return graphId;
  }

  const matching = {};

  const copyAc = graphObjTmp.activities.map(ac => {
    const id = uuid();
    matching[ac._id] = id;
    return {
      ...ac,
      _id: id,
      graphId,
      actualStartingTime: undefined,
      actualClosingTime: undefined,
      state: undefined,
      templateRZCloned: undefined
    };
  });

  const copyOp = graphObjTmp.operators.map(op => {
    const id = uuid();
    matching[op._id] = id;
    return { ...op, _id: id, graphId, state: undefined };
  });

  // Here we change the configured ids of activities and operators which
  // have to change due to the copy
  const newConn = graphObjTmp.connections.map(connection => {
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

  const newAc = copyAc.map(ac => ({
    ...ac,
    data: replaceFromMatching(matching, ac.data),
    streamTarget: matching[ac.streamTarget]
  }));

  const newOp = copyOp.map(op => ({
    ...op,
    data: replaceFromMatching(matching, op.data)
  }));
  newAc.forEach(x => insertActivityMongo(x));
  newOp.forEach(x => insertOperatorMongo(x));
  newConn.forEach(x => Connections.insert(x));
  return graphId;
};

export const renameGraph = (graphId: string, name: string) =>
  Graphs.update(graphId, { $set: { name } });

// updating graph from graph editor
export const mergeGraph = (mergeObj: Object) => {
  Meteor.call('graph.merge', mergeObj);
};

export const setCurrentGraph = (graphId: string) => {
  if (Meteor.user()?.profile?.editingGraph !== graphId) {
    Meteor.users.update(Meteor.userId(), {
      $set: { 'profile.editingGraph': graphId }
    });
  }
};

export const assignGraph = (wantedId?: string) => {
  const user = Meteor.user();
  if (wantedId && Graphs.findOne(wantedId)) {
    return wantedId;
  }
  let graphId;
  // Get the graph the user is editing and check if the graph exists
  graphId = user.profile ? user.profile.editingGraph : null;
  graphId = graphId && Graphs.findOne(graphId) ? graphId : null;
  // Assign the id of the first graph of the graph that belongs to the user list if there is one
  const oneGraph = Graphs.findOne({ ownerId: Meteor.user()._id });
  if (!graphId) graphId = oneGraph ? oneGraph._id : null;
  // If nothing worked create new graph
  if (!graphId) graphId = addGraph();
  setCurrentGraph(graphId);
  return graphId;
};

// 2 with same name (in remoteGraph)
export const removeGraph = (graphId: string) =>
  Meteor.call('graph.flush.all', graphId);

Meteor.methods({
  'create.graph.from.activity': createSessionFromActivity,
  'graph.merge': ({
    connections,
    activities,
    operators,
    graphId,
    graphDuration,
    broken
  }) => {
    console.log('graph merge', broken);
    if (Graphs.findOne(graphId)) {
      Graphs.update(graphId, { $set: { duration: graphDuration, broken } });

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
  },
  'graph.flush.all': graphId => {
    Graphs.remove(graphId);
    Activities.remove({ graphId });
    Operators.remove({ graphId });
    Connections.remove({ graphId });
    Sessions.remove({ graphId });
  },
  'graph.flush.activity': activityId => {
    Operators.remove({ from: activityId });
    Operators.remove({ to: activityId });
    Activities.remove(activityId);
  }
});
