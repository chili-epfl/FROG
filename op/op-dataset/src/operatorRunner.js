// @flow

import { type productOperatorRunnerT, wrapUnitAll, values } from 'frog-utils';

const operator = (_, object) => {
  const { payload } = object.activityData;
  const dataset = [];
  values(payload)
    .filter(x => x.data?.answers)
    .forEach(instanceData => {
      // builds dataset with only the first two answers
      const x = instanceData.data.answers[0];
      const y = instanceData.data.answers[1];
      const toAppend = { trace: 'dataset', x, y };
      if (x && y) dataset.push(toAppend);
    });

  return wrapUnitAll(dataset);
};

export default (operator: productOperatorRunnerT);
