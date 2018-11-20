// @flow

import { type productOperatorRunnerT, wrapUnitAll, values } from 'frog-utils';

const operator = (config, object) => {
  const { payload } = object.activityData;
  const { primary, secondary, filterMin, filterMax } = config;

  const dataset = [];
  values(payload)
    .filter(x => x.data?.form)
    .forEach(instanceData => {
      // builds dataset with only the first two answers
      const { form } = instanceData.data;
      let x;
      x = Number(form[primary].value);
      if (x && filterMin !== undefined && x < filterMin) x = undefined;
      if (x && filterMax !== undefined && x > filterMax) x = undefined;

      let y;
      if (secondary !== undefined) y = instanceData.data.answers[secondary];

      if (x && y) dataset.push({ trace: 'dataset', x, y });
      else if (x) dataset.push({ trace: 'dataset', x });
    });

  return wrapUnitAll(dataset);
};

export default (operator: productOperatorRunnerT);
