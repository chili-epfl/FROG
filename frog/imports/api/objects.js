// @flow

import { Mongo } from 'meteor/mongo';
import type { ObjectT } from '/imports/frog-utils'; // eslint-disable-line
import { uuid } from '/imports/frog-utils'; // eslint-disable-line

export const Objects = new Mongo.Collection('objects');

export const addObject = (activityId: string, data: ObjectT) => {
  Objects.update(activityId, data, { upsert: true });
};
