// @flow

import type { ObjectT, SocialStructureT } from 'frog-utils';

export const meta = {
  name: 'Argue',
  type: 'social'
};

export const config = {
  title: 'Configuration for Argue',
  type: 'object',
  properties: {}
};

const shuffleList = (xs: Array<any>): Array<any> => {
  const arr = xs.slice(0);
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

export const operator = (configData: Object, object: ObjectT) => {
  const { globalStructure, products } = object;
  const product = products[0];

  // computes the distance between two students as the number of different answers
  const distance = (id1, id2) => {
    const prod1 = product.find(p => p.userId === id1);
    const prod2 = product.find(p => p.userId === id2);
    return prod1 && prod2
      ? Object.keys(prod1.data)
          .filter(q => prod1.data[q].radio !== prod2.data[q].radio).length
      : 0;
  };

  // creates a random matching
  const randomMatching = studentIds => shuffleList(studentIds);

  // evaluates the quality of a matching
  const evaluateMatching = matching => {
    let totalDistance = 0;
    for (let s = 0; s + 1 < matching.length; s += 2) {
      totalDistance += distance(matching[s], matching[s + 1]);
    }
    return 2 * totalDistance / matching.length;
  };

  let matching;
  let score;
  let bestMatching = globalStructure.studentIds;
  let bestScore = 0;

  // Iterates many time while keeping the best matching encountered
  for (let iteration = 0; iteration < 100; iteration += 1) {
    matching = randomMatching(globalStructure.studentIds);
    score = evaluateMatching(matching);
    if (score > bestScore) {
      bestScore = score;
      bestMatching = matching;
    }
  }

  // uses the computed best matching to build the social structure
  const socStruc: SocialStructureT = {};
  bestMatching.forEach((studentId, index) => {
    socStruc[studentId] = {
      group: Math.floor(index / 2).toString()
    };
  });

  return {
    product: [],
    socialStructure: socStruc
  };
};

export default {
  id: 'op-argue',
  operator,
  config,
  meta
};
