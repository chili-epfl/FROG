// @flow

import { chunk } from 'lodash';
import type { socialOperatorT, socialStructureT } from 'frog-utils';

const meta = {
  name: 'Argue',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {};

const optim = values => values.reduce((acc, x) => acc + Math.sqrt(x), 0);

const testInput = instances => {
  if (instances.find(i => typeof i !== 'string')) {
    throw 'instances should all be strings';
  }
  return true;
};

const operator = (configData, object): socialStructureT => {
  const {
    activityData: { payload }
  } = object;
  const { instances, distanceMatrix } = payload.all.data;
  testInput(instances);

  const groups = { '1': [] };

  const last = instances.length % 2 ? instances.pop() : null;

  if (last && instances.length === 0) {
    groups['1'] = [last];
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
      const pair = tmp[i].map(x => instances[x] || last);
      if (Array.isArray(pair)) {
        groups['' + (i + 1)] = pair;
      }
    }
  }

  const unmatchedStudents = object.globalStructure.studentIds.filter(
    id => !instances.includes(id) && id !== last
  );
  chunk(unmatchedStudents, 2).forEach((pair, idx) => {
    groups['unmatched' + (idx + 1)] = pair;
  });

  return { group: groups };
};

export default ({
  id: 'op-argue',
  type: 'social',
  operator,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
