import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from '/imports/frog-utils';
import { Graphs } from './graphs';

export const Templates = new Mongo.Collection('templates');

export const addTemplate = (name, graph) =>
  Templates.insert({
    _id: uuid(),
    name,
    graph,
    ownerId: Meteor.userId(),
    createdAt: new Date()
  });

export const findTemplate = id => Templates.findOne(id);

export const updateTemplate = (id, graph) =>
  Templates.update(id, { $set: { graph } });

export const setTemplateUIStatus = (id, statusVal) => {
  Templates.update(id, { $set: { uiStatus: statusVal } });
};

export const removeTemplate = id => {
  Templates.remove(id);
  Graphs.update(
    { templateSource: id },
    { $set: { templateSource: null } },
    { multi: true }
  );
};
