// @flow
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';
import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { activityTypesObj } from '/imports/activityTypes';

const genericDoc = connection.get('li');
export const dataFn = generateReactiveFn(genericDoc, LI, {
  createdByUser: Meteor.userId()
});
export const LearningItem = dataFn.LearningItem;

// Creates an LI entry in the 'li' collection.
export const createNewLI = (
  wikiId: string,
  liType: string,
  activityConfig?: any,
  pageTitle?: string
) => {
  const meta = {
    wikiId
  };
  if (liType === 'li-activity') {
    // Need to create an entry for the activity in the 'rz' collection before creating the LI
    const { activityType, config } = activityConfig;
    const id = uuid();
    const doc = connection.get('rz', id + '/all');
    doc.create(activityTypesObj[activityType].dataStructure || {});
    const payload = {
      acType: activityType,
      activityData: { config },
      rz: id + '/all',
      title: pageTitle || '',
      activityTypeTitle: activityTypesObj[activityType].meta.name
    };
    return dataFn.createLearningItem(liType, payload, meta);
  }
  return dataFn.createLearningItem(liType, undefined, meta);
};
