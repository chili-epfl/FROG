// @flow

import { shuffle, chunk } from 'lodash';
import type { socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Argue',
  type: 'social'
};

const config = {
  type: 'object',
  properties: {}
};

const flatten = data => {
  const result = {};
  function recurse(cur, prop) {
    if (typeof cur === 'string' || typeof cur === 'number') {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      const l = cur.length;
      for (let i = 0; i < l; i += 1) recurse(cur[i], prop + '[' + i + ']');
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      if (cur) {
        const ks = Object.keys(cur);
        for (let k = 0; k < ks.length; k += 1) {
          const p = ks[k];
          isEmpty = false;
          recurse(cur[p], prop ? prop + '_' + p : p);
        }
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, '');
  return result;
};

const operator = (configData, object) => {
  const { globalStructure, activityData: { payload } } = object;
  const ids = shuffle(globalStructure.studentIds);
  const students = dataToArray(ids, payload);
  const last = students.length % 2 ? students.pop() : null;

  const distances = computeDist(students);
  const tmp = chunk([...students.keys()], 2);
  let modified = false;

  do {
    modified = false;

    for (let i = 0; i < tmp.length - 1 && !modified; i = 1 + i) {
      const dP1 = distances[tmp[i][0]][tmp[i][1]];

      for (let j = i + 1; j < tmp.length && !modified; j = 1 + j) {
        if (
          Math.min(
            distances[tmp[i][0]][tmp[j][0]],
            distances[tmp[i][1]][tmp[j][1]]
          ) > dP1
        ) {
          const k = tmp[i][1];
          tmp[i][1] = tmp[j][0];
          tmp[j][0] = k;
          modified = true;
        } else if (
          Math.min(
            distances[tmp[i][0]][tmp[j][1]],
            distances[tmp[i][1]][tmp[j][0]]
          ) > dP1
        ) {
          const k = tmp[i][1];
          tmp[i][1] = tmp[j][1];
          tmp[j][1] = k;
          modified = true;
        }
      }
    }
  } while (modified);

  if (last) {
    let maxDif = 0;
    let maxDist = 0;
    let maxInd = 0;

    for (let i = 0; i < tmp.length; i += 1) {
      const tmp1 = dist(students[tmp[i][0]], last);
      const tmp2 = dist(students[tmp[i][1]], last);
      const tmp3 = new Set(tmp2);
      tmp1.forEach(x => tmp3.add(x));
      if (
        tmp3.size >= maxDif &&
        (tmp3.size > maxDif || tmp1.size + tmp2.size > maxDist)
      ) {
        maxDif = tmp3.size;
        maxDist = tmp1.size + tmp2.size;
        maxInd = i;
      }
    }
    tmp[maxInd].push(students.length);
  }

  const result = { group: {} };

  for (let i = 0; i < tmp.length; i = 1 + i) {
    tmp[i].sort((a, b) => a - b);
    result.group[(i + 1).toString()] = tmp[i].map(x => ids[x]);
  }
  return result;
};

const dataToArray = (ids, payload) => ids.map(id => flatten(payload[id].data));

const computeDist = tab => {
  const result = [];

  for (let i = 0; i < tab.length; i = 1 + i) {
    result[i] = [];
    for (let j = 0; j <= i; j = 1 + j) {
      const tmp = dist(tab[i], tab[j]).size;
      result[i][j] = tmp;
      result[j][i] = tmp;
    }
  }
  return result;
};

const dist = (A, B) =>
  Object.keys(Object.assign({}, A, B))
    .filter(k => A[k] !== B[k])
    .reduce((acc, k) => acc.add(k), new Set());

export default ({
  id: 'op-argue',
  operator,
  config,
  meta
}: socialOperatorT);
