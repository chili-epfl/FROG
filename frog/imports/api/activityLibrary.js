// @flow

import { Mongo } from 'meteor/mongo';

import { uuid } from 'frog-utils';

export const ActivityLibrary = new Mongo.Collection('activity_library');

export const addActivityToLibrary = (
  parentId: string,
  title: string,
  description: string,
  activityType: string,
  configuration: Object,
  tags: ?(string[])
) => {
  ActivityLibrary.insert({
    _id: uuid(),
    parentId,
    title,
    description,
    activityType,
    configuration,
    exportedAt: new Date(),
    tags
  });
};

export const removeActivity = (id: string) =>
  ActivityLibrary.remove({ _id: id });
