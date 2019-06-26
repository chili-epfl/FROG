// @flow
import { Meteor } from 'meteor/meteor'

import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import { connection } from '../App/connection';
import LI from '../LearningItem';

const genericDoc = connection.get('li');
export const dataFn = generateReactiveFn(genericDoc, LI, {
  createdByUser: Meteor.userId()
});
export const LearningItem = dataFn.LearningItem;
