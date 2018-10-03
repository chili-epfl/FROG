// @flow

import { type productOperatorRunnerT, wrapUnitAll, values } from 'frog-utils';

const operator = (_, object) => {
  const { payload } = object.activityData;
  const dataset = [];
  values(payload)
    .filter(x => x.data && !!x.data.answers)
    .forEach(x => {
      x.data.answers.forEach((a, i) => {
        const toAppend = { trace: 'dataset ' + (i + 1), x: a };
        dataset.push(toAppend);
      });
    });

  return wrapUnitAll(dataset);
};

export default (operator: productOperatorRunnerT);
