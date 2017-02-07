import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';
import { Activities, Connections, Operators } from './activities';

export const Graphs = new Mongo.Collection('graphs');

export const addGraph = (name = 'untitled') => {
  const id = uuid();
  Graphs.insert({ _id: id, name, createdAt: new Date() });
  return id;
};

export const importGraph = params => {
  const id = params._id;
  Graphs.insert({ ...params, _id: id, createdAt: new Date() });
  return id;
};

export const renameGraph = (graphId, name) =>
  Graphs.update({ _id: graphId }, { $set: { name } });

// updating graph from graph editor
export const mergeGraph = mergeObj => {
  Meteor.call('graph.merge', mergeObj);
};

export const setCurrentGraph = graphId => {
  Meteor.users.update({ _id: Meteor.userId() }, {
    $set: { 'profile.editingGraph': graphId }
  });
};

export const assignGraph = () => {
  const user = Meteor.users.findOne({ _id: Meteor.userId() });
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

Meteor.methods({
  'graph.merge': ({ connections, activities, operators, graphId }) => {
    activities.map(({ _id, ...rest }) =>
      Activities.update({ _id }, { $set: rest }, { upsert: true }));
    const actid = activities.map(x => x._id);
    Activities.remove({ _id: { $nin: actid }, graphId });

    operators.map(({ _id, ...rest }) =>
      Operators.update({ _id }, { $set: rest }, { upsert: true }));
    const optid = operators.map(x => x._id);
    Operators.remove({ _id: { $nin: optid }, graphId });

    connections.map(({ _id, ...rest }) =>
      Connections.update({ _id }, { $set: rest }, { upsert: true }));
    const conid = connections.map(x => x._id);
    Connections.remove({ _id: { $nin: conid }, graphId });
  }
});
