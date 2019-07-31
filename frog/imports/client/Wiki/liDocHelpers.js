// @flow
import { uuid } from '/imports/frog-utils';
import { connection } from '../App/connection';
import { activityTypesObj } from '/imports/activityTypes';
import { dataFn } from './wikiLearningItem';

// Creates an LI entry in the 'li' collection.
export const createNewLI = (
  wikiId: string,
  liType: string,
  activityConfig?: any,
  pageTitle?: string,
  opData: any
) => {
  const meta = {
    wikiId
  };
  if (liType === 'li-activity') {
    // Need to create an entry for the activity in the 'rz' collection before creating the LI
    const { activityType, config } = activityConfig;

    const dS = opData || activityTypesObj[activityType]?.dataStructure;

    const id = uuid();
    const doc = connection.get('rz', id + '/all');
    const initData = typeof dS === 'function' ? dS(config) : dS;
    doc.create(initData || {});
    const payload = {
      acType: activityType,
      activityData: {
        config
      },
      rz: id + '/all',
      title: pageTitle,
      activityTypeTitle: activityTypesObj[activityType].meta.name
    };
    return dataFn.createLearningItem(liType, payload, meta);
  }
  return dataFn.createLearningItem(liType, undefined, meta);
};
