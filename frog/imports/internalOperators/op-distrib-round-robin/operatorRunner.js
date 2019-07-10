// @flow

import { type productOperatorRunnerT, getRotateable } from 'frog-utils';
import { merge, range } from 'lodash';

const operator = (configData, { activityData, socialStructure }) => {
  if (activityData.structure === 'all') {
    console.error('Trying to distribute product from all, returning same');
    return activityData;
  }

  let instances;
  const { structure } = activityData;
  if (structure === 'individual') {
    instances = Object.keys(activityData.payload);
  } else {
    instances = Object.keys(socialStructure[structure.groupingKey]);
  }
  const count = Math.min(configData.count || 1, instances.length - 1);

  const shuffles = range(1, count + 1).map(i =>
    getRotateable(instances, i + (configData.offset || 0))
  );
  return {
    structure: activityData.structure,
    payload: instances.reduce((acc, x, i) => {
      acc[x] = {
        config: {},
        data: merge(
          {},
          ...shuffles.map(shuff => activityData.payload[shuff[i]].data)
        )
      };
      return acc;
    }, {})
  };
};

export default (operator: productOperatorRunnerT);
