import { Meteor } from 'meteor/meteor';
import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';

const genericDoc = connection.get('li');
export const dataFn = generateReactiveFn(genericDoc, LI, {
  createdByUser: Meteor.userId()
});
export const LearningItem = dataFn.LearningItem;

export const createNewGenericLI = wikiId => {
  const meta = {
    wikiId
  };
  const newId = dataFn.createLearningItem(
    'li-richText',
    undefined,
    meta,
    undefined,
    undefined,
    undefined
  );
  return newId;
};
