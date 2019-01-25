// @flow

import { type productOperatorRunnerT, uuid } from 'frog-utils';
import { cloneDeep, orderBy } from 'lodash';

const operator = (configData, { activityData }) => {
  const newAD = cloneDeep(activityData);
  Object.keys(activityData.payload).forEach(instance => {
    const items = orderBy(
      Object.values(activityData.payload[instance].data),
      [z => z.score || ''],
      ['desc']
    );
    const reducedItems = items.slice(0, configData.topN || 1);
    const res = reducedItems.reduce((acc, y) => {
      const id = y.id || uuid();
      acc[id] = { ...y, id };
      return acc;
    }, {});
    newAD.payload[instance].data = res;
  });
  return newAD;
};

export default (operator: productOperatorRunnerT);
