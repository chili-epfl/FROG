// @flow

import { shuffleList, type ObjectT, type SocialStructureT } from 'frog-utils';

export const meta = {
  name: 'Argue',
  type: 'social'
};

export const config = {
  title: 'Configuration for Argue',
  type: 'object',
  properties: {}
};

export const operator = (configData: Object, object: ObjectT) => {
  const { globalStructure, products } = object;
  const product = products[0]
  console.log(product)

  // computes the distance between two students as the number of different answers
  const distance = (id1, id2) => {
    return 1.
  }

  // creates a random matching
  const randomMatching = (studentIds) => {
    return shuffleList(studentIds)
  }

  // evaluates the quality of a matching
  const evaluateMatching = (matching) => {
    var totalDistance = 0.
    for(var s = 0; s + 2 < matching.length; s += 2){
      totalDistance += distance(matching[s], matching[s+1])
    }
    return 2. * totalDistance / matching.length
  }

  var matching;
  var score;
  var bestMatching = globalStructure.studentIds;
  var bestScore = 0;

  // Iterates many time while keeping the best matching encountered
  for(var iteration = 0; iteration < 100; ieration += 1){
    matching = randomMatching(globalStructure.studentIds)
    score = evaluateMatching(matching, distance)
    if(score > bestScore){
      bestScore = score
      bestMatching = matching
      console.log(bestScore)
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
