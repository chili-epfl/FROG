import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from '/imports/frog-utils';
import { Graphs, addGraph } from './graphs';
import { Operators } from './operators';
import { Activities, Connections } from './activities';

export const Templates = new Mongo.Collection('templates');

export const addTemplate = (name, graphId) => {
  const templateId = uuid();
  Templates.insert({
    name: name,
    graphId: graphId,
    _id: templateId,
    templateId: templateId,
    ownerId: Meteor.userId(),
    createdAt: new Date()
  });
  console.info(`Added ${templateId}`);
};

export const findTemplate = id => {
  const template = Templates.findOne(id);
  return template;
};

export const addTemplateGraph = (graphId, templateId) => {
  const graph = Graphs.findOne(graphId);
  const activities = Activities.find({ graphId }).fetch();

  const newGraphId = addGraph({
    graph: { ...graph, sessionGraph: true, name: graph.name },
    activities,
    operators: Operators.find({ graphId }).fetch(),
    connections: Connections.find({ graphId }).fetch()
  });
};
