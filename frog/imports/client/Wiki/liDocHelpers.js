// @flow
import { uuid } from '/imports/frog-utils';
import { connection } from '../App/connection';
import { activityTypesObj } from '/imports/activityTypes';
import { dataFn } from './wikiLearningItem';

// Creates an LI entry in the 'li' collection.
export const createNewLI = async (
  wikiId: string,
  liType: string,
  activityConfig?: any,
  pageTitle?: string
) => {
  const meta = {
    wikiId
  };
  console.log(activityConfig, liType);
  if (liType === 'li-activity') {
    // Need to create an entry for the activity in the 'rz' collection before creating the LI
    const { activityType, config } = activityConfig;

    let dS = activityTypesObj[activityType]?.dataStructure || {};

    if (activityType.slice(0, 3) == 'op-') {
      dS = await new Promise((resolve, reject) =>
        Meteor.call('run.operator', activityType, config, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        })
      );
    }

    const id = uuid();
    const doc = connection.get('rz', id + '/all');
    const initData = typeof dS === 'function' ? dS(config) : dS;
    doc.create(initData || {});
    const payload = {
      acType: activityType,
      activityData: { config },
      rz: id + '/all',
      title: pageTitle,
      activityTypeTitle: activityTypesObj[activityType].meta.name
    };
    return dataFn.createLearningItem(liType, payload, meta);
  }
  return dataFn.createLearningItem(liType, undefined, meta);
};
