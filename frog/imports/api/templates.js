import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from '/imports/frog-utils';
import { Graphs } from './graphs';

export const Templates = new Mongo.Collection('templates');

export const addTemplate = (name, graph) => {
  const templateId = uuid();
  Templates.insert({
    name: name,
    graph: graph,
    _id: templateId,
    ownerId: Meteor.userId(),
    createdAt: new Date()
  });
  return templateId;
};

export const findTemplate = id => {
  return Templates.findOne(id);
};

export const updateTemplate = (id, graph) => {
  try {
    const doc = Templates.findOne(id);
    const template = Templates.update(
      { _id: doc._id },
      { $set: { graph: graph } }
    );
    return template;
  } catch (err) {
    console.warn(`Error updating template. Error Log: ${err}`);
    return false;
  }
};

export const removeTemplate = id => {
  try {
    const doc = Templates.findOne(id);
    Templates.remove({ _id: doc._id });
    Graphs.update(
      { templateSource: id },
      { $set: { templateSource: null } },
      { multi: true }
    );
    return true;
  } catch (err) {
    console.warn(`Error deleting template. Error Log: ${err}`);
    return false;
  }
};

export const clearAllTemplates = () => {
  const templatesList = Templates.find({}).fetch();
  templatesList.map(item => {
    Templates.remove({ _id: item._id });
  });
};
