// @flow

import { type productOperatorRunnerT, wrapUnitAll, values } from 'frog-utils';

const operator = (config, object) => {
  const { payload } = object.activityData;

  const datasets = [];
  values(payload).forEach(instanceData => {
    config.datasets.forEach((datasetConfig, idx) => {
      const {
        primary,
        primaryType,
        secondary,
        secondaryType,
        filterMin,
        filterMax,
        name
      } = datasetConfig;
      const trace = name || 'dataset ' + idx;
      // builds dataset with only the first two answers
      const { form, answers } = instanceData.data;
      let x;
      if (primaryType === 'numerical' && form) {
        x = Number(form[primary].value);
        if (x && filterMin !== undefined && x < filterMin) x = undefined;
        if (x && filterMax !== undefined && x > filterMax) x = undefined;
      } else if (primaryType === 'categorical' && answers) {
        x = answers[primary];
      }

      let y;
      if (secondary !== undefined) {
        if (secondaryType === 'numerical' && form) {
          y = Number(form[secondary].value);
        } else if (secondaryType === 'categorical' && answers) {
          y = answers[secondary];
        }
      }

      if (x && y) datasets.push({ trace, x, y });
      else if (x) datasets.push({ trace, x });
    });
  });

  return wrapUnitAll(datasets);
};

export default (operator: productOperatorRunnerT);
