// @flow

import { type productOperatorRunnerT, uuid } from 'frog-utils';

const createLI = (dataFn, item, litype, from) => {
  const id = uuid();
  const reviewLi = dataFn.createLearningItem('li-richText');
  const li = dataFn.createLearningItem(
    'li-peerReview',
    {
      reviewItem: item.data,
      reviewComponentLIType: litype,
      reviewId: reviewLi,
      from
    },
    undefined,
    true
  );
  return { [id]: { id, li, from } };
};

const operator = (configData, { activityData }, dataFn) => {
  const instances = Object.keys(activityData.payload);
  const structure = activityData.structure;
  return {
    structure: activityData.structure,
    payload: instances.reduce((acc, x) => {
      acc[x] = {
        data: createLI(
          dataFn,
          activityData.payload[x],
          configData.liType || 'li-textArea',
          typeof structure === 'object' ? { [structure.groupingKey]: x } : x
        )
      };
      return acc;
    }, {})
  };
};

export default (operator: productOperatorRunnerT);
