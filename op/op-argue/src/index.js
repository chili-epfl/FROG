// @flow

// import { shuffle } from 'lodash';
import type { ObjectT, socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Argue',
  type: 'social'
};

const config = {
  type: 'object',
  properties: {}
};

const operator = (configData: Object, object: ObjectT) => {
  // const { globalStructure, activityData } = object;

  // computes the distance between two students as the number of different answers
  // const distance = (id1, id2) => {
  //   const prod1 = product && product.find(p => p.userId === id1);
  //   const prod2 = product && product.find(p => p.userId === id2);
  //   return prod1 && prod2
  //     ? Object.keys(prod1.data).filter(
  //         q => prod1.data[q].radio !== prod2.data[q].radio
  //       ).length
  //     : 0;
  // };

  // // creates a random matching
  // const randomMatching = studentIds => shuffle(studentIds);

  // // evaluates the quality of a matching
  // const evaluateMatching = matching => {
  //   let totalDistance = 0;
  //   for (let s = 0; s + 1 < matching.length; s += 2) {
  //     totalDistance += distance(matching[s], matching[s + 1]);
  //   }
  //   return 2 * totalDistance / matching.length;
  // };

  // let matching;
  // let score;
  // let bestMatching = globalStructure.studentIds;
  // let bestScore = 0;

  // // Iterates many time while keeping the best matching encountered
  // for (let iteration = 0; iteration < 100; iteration += 1) {
  //   matching = randomMatching(globalStructure.studentIds);
  //   score = evaluateMatching(matching);
  //   if (score > bestScore) {
  //     bestScore = score;
  //     bestMatching = matching;
  //   }
  // }

  // // uses the computed best matching to build the social structure
  // const socStruc: SocialStructureT = {};
  // bestMatching.forEach((studentId, index) => {
  //   socStruc[studentId] = {
  //     group: Math.floor(index / 2).toString()
  //   };
  // });

  return {};
};

export default ({
  id: 'op-argue',
  operator,
  config,
  meta
}: socialOperatorT);
