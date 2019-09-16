import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from '/imports/frog-utils';

export const Templates = new Mongo.Collection('templates');

export const addTemplate = (name, graphId) => {
  Templates.insert({
    name: name,
    graphId: graphId,
    _id: uuid(),
    ownerId: Meteor.userId(),
    createdAt: new Date()
  });
};

export const findTemplate = id => {
  const template = Templates.findOne(id);
  return template;
};
