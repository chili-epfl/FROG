// @flow
// import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { uuid } from 'frog-utils';

export const Library = new Mongo.Collection('library');

export const addActivity = (
  parentId: string,
  title: string,
  description: string,
  activityType: string,
  configuration: Object,
  groupingKey: ?string,
  tags: ?string[]
) => {

    Library.insert({
      _id: uuid(),
      parentId,
      title,
      description,
      activityType,
      configuration,
      groupingKey,
      exportedAt: new Date(),
      tags
    });
  };

  export const removeActivity = (id: string) =>
  Library.remove({_id: id})
