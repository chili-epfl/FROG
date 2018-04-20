// @flow

import { chunk } from 'lodash';
import type { socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Argue',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {};

const optim = values => values.reduce((acc, x) => acc + Math.sqrt(x), 0);

const operator = (configData, object) => {
  const {
    activityData: { payload }
  } = object;
  const { instances, distanceMatrix } = payload.all.data;

  const result = { group: { '1': [] } };

  const last = instances.length % 2 ? instances.pop() : null;

  if (instances.length === 0) {
    result.group['1'] = [last];
  } else {
    const tmp = chunk([...instances.keys()], 2);

    let modified = true;
    let iter = 0;
    while (modified && iter < 10000) {
      iter += 1;
      modified = false;
      for (let i = 0; i < tmp.length && !modified; i = 1 + i) {
        for (let j = i + 1; j < tmp.length && !modified; j = 1 + j) {
          const currentScore = optim([
            distanceMatrix[tmp[i][0]][tmp[i][1]],
            distanceMatrix[tmp[j][0]][tmp[j][1]]
          ]);
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
    }

    if (last) {
      tmp[0].push(instances.length);
    }

    for (let i = 0; i < tmp.length; i = 1 + i) {
      tmp[i].sort((a, b) => a - b);
      result.group[(i + 1).toString()] = tmp[i].map(x => instances[x] || last);
    }
  }

  const unmatchedStudents = object.globalStructure.studentIds.filter(
    id => !instances.includes(id) && id !== last
  );
  chunk(unmatchedStudents, 2).forEach((pair, idx) => {
    result.group['unmatched' + (idx + 1)] = pair;
  });

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
