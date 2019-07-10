// @flow

import {
  type productOperatorRunnerT,
  uuid,
  getRotateable,
  cloneDeep
} from 'frog-utils';
import { range, merge, set } from 'lodash';

const createLI = (dataFn, item, litype, from, prompt, distribute) => {
  const id = uuid();
  const reviewLi = distribute ? null : dataFn.createLearningItem(litype);
  const li = dataFn.createLearningItem(
    'li-peerReview',
    {
      reviewItem: item.data,
      reviewComponentLIType: litype,
      reviewId: reviewLi,
      prompt,
      from
    },
    undefined,
    true
  );
  return { [id]: { id, li, from } };
};

const renew = (oldObj, dataFn) => {
  const obj = cloneDeep(oldObj);
  Object.keys(obj).forEach(x =>
    set(
      obj[x],
      'li.liDocument.payload.reviewId',
      dataFn.createLearningItem(
        obj[x].li.liDocument.payload.reviewComponentLIType
      )
    )
  );
  return obj;
};

const operator = (configData, { activityData }, dataFn) => {
  const instances = Object.keys(activityData.payload);
  const { structure } = activityData;

  let ret = {
    structure: activityData.structure,
    payload: instances.reduce((acc, x) => {
      acc[x] = {
        data: createLI(
          dataFn,
          activityData.payload[x],
          configData.responseLIType || 'li-richText',
          typeof structure === 'object' ? { [structure.groupingKey]: x } : x,
          configData.prompt,
          configData.distribute && structure !== 'all'
        )
      };
      return acc;
    }, {})
  };

  if (configData.distribute && structure !== 'all') {
    const count = Math.min(
      configData.count || 1,
      instances.length - 1 - (configData.offset || 0)
    );

    const shuffles = range(1, count + 1).map(i =>
      getRotateable(instances, i + (configData.offset || 0))
    );
    const newRet = {
      structure: ret.structure,
      payload: instances.reduce((acc, x, i) => {
        acc[x] = {
          config: {},
          data: merge(
            {},
            ...shuffles.map(shuff => renew(ret.payload[shuff[i]].data, dataFn))
          )
        };
        return acc;
      }, {})
    };
    ret = newRet;
  }
  return ret;
};

export default (operator: productOperatorRunnerT);
