// @flow

import { type productOperatorRunnerT, wrapUnitAll, values } from 'frog-utils';

const operator = (_, object) => {
  const { payload } = object.activityData;
  const dataset = [];
  values(payload)
    .filter(x => x.data && !!x.data.answers)
    .forEach(instanceData => {
      // builds dataset with only the first two answers
      const x = instanceData.data.answersIndex[0] + 1;
      const y = instanceData.data.answers[1];
      const toAppend = { trace: 'dataset', x, y };
      if (x > 0 && !!y) dataset.push(toAppend);
    });

  return wrapUnitAll(dataset);
};

export default (operator: productOperatorRunnerT);
