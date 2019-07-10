// @flow
import { uuid } from 'frog-utils';
import LI from '../LearningItem';
import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import { activityTypesObj } from '/imports/activityTypes';
import { dataFn } from './wikiLearningItem';

// Creates an LI entry in the 'li' collection.
export const createNewLI = async (
  wikiId: string,
  liType: string,
  activityConfig?: any,
  pageTitle?: string,
  data?: any
) => {
  const meta = {
    wikiId
  };
  if (liType === 'li-activity') {
    // Need to create an entry for the activity in the 'rz' collection before creating the LI
    const { activityType, config } = activityConfig;
    const id = uuid();
    const doc = connection.get('rz', id + '/all');
    await new Promise(resolve => doc.subscribe(() => resolve()));
    const dataFnRZ = generateReactiveFn(doc, LI);
    const aT = activityTypesObj[activityType];
    const dS = aT.dataStructure;
    const initData = typeof dS === 'function' ? dS(config) : dS;
    console.log(initData);
    doc.create(initData || {});
    if (data && aT.mergeFunction) {
      aT.mergeFunction(data, dataFnRZ);
    }
    const payload = {
      acType: activityType,
      activityData: { config },
      rz: id + '/all',
      title: pageTitle,
      activityTypeTitle: activityTypesObj[activityType].meta.name
    };
    console.log(payload);
    const res = dataFn.createLearningItem(liType, payload, meta, true);
    console.log(res);
    return res;
  }
  return dataFn.createLearningItem(liType, undefined, meta);
};
