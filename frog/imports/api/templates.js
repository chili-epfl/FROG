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
};

export const findTemplate = id => {
  if (id) {
    const template = Templates.findOne(id);
    return template;
  }
  return null;
};

export const updateTemplate = (id, graph) => {
  try {
    const template = Templates.findAndModify({
      query: { _id: id },
      update: { graph: graph }
    });
    return template;
  } catch (err) {
    window.alert('Error updating template');
    console.warn('Error updating template');
  }
};

export const removeTemplate = id => {
  Templates.remove({ _id: id });
  Graphs.update(
    { templateSource: id },
    { templateSource: null },
    { multi: true }
  );
};

export const clearAllTemplates = () => {
  const templatesList = Templates.find({}).fetch();
  templatesList.map(item => {
    Templates.remove({ _id: item._id });
  });
};
