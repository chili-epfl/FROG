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
  const id = uuid();
  ActivityLibrary.insert({
    _id: id,
    parentId,
    title,
    description,
    activityType,
    configuration,
    exportedAt: new Date(),
    tags
  });
  return id;
};

export const removeActivity = (id: string) =>
  ActivityLibrary.remove({ _id: id });
