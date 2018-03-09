// @flow

import { chunk } from 'lodash';
import type { socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Argue',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {}
};

const optim = (values) => values.reduce((acc,x) => acc + Math.sqrt(x), 0)

const operator = (configData, object) => {
  const { activityData: { payload } } = object;
  const { instances, distanceMatrix } = payload.all.data

  if (instances.length === 1) return { group: { '1': [ instances[0] ] } };

  const last = instances.length % 2 ? instances.pop() : null;

  const tmp = chunk([...instances.keys()], 2);

  let modified = true
  let iter = 0
  while (modified && iter < 10000) {
    iter += 1;
    modified = false;
    for (let i = 0; i < tmp.length && !modified; i = 1 + i) {
      for (let j = i+1; j < tmp.length && !modified; j = 1 + j) {
        const currentScore = optim([
          distanceMatrix[tmp[i][0]][tmp[i][1]],
          distanceMatrix[tmp[j][0]][tmp[j][1]]
        ])
        if (
          optim([
            distanceMatrix[tmp[i][0]][tmp[j][0]],
            distanceMatrix[tmp[i][1]][tmp[j][1]]
          ]) > currentScore
        ) {
          const k = tmp[i][1];
          tmp[i][1] = tmp[j][0];
          tmp[j][0] = k;
          modified = true;
        } else if (
          optim([
            distanceMatrix[tmp[i][0]][tmp[j][1]],
            distanceMatrix[tmp[i][1]][tmp[j][0]]
          ]) > currentScore
        ) {
          const k = tmp[i][1];
          tmp[i][1] = tmp[j][1];
          tmp[j][1] = k;
          modified = true;
        }
      }
    }
  };

  if (last) {
    tmp[0].push(instances.length);
  }

  const result = { group: {} };

  for (let i = 0; i < tmp.length; i = 1 + i) {
    tmp[i].sort((a, b) => a - b);
    result.group[(i + 1).toString()] = tmp[i].map(x => instances[x] || last);
  }
  return result;
};

export default ({
  id: 'op-argue',
  type: 'social',
  operator,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
