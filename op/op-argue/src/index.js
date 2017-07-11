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

const operator = (configData, object) =>{
  const { students } = object;
  console.log(students);
  const distances = computeDist(students);
  //console.log(distances);

  const av = computeAv(distances);
  //console.log(av); => 2
  //const k = Object.keys(students);
  let tmp = chunk(shuffle([...Object.keys(students)]), 2);

  let end = false;
  while(end){
    const dP1 = distances[tmp[0][0]][tmp[0][1]];
    for(i=0; i < distances.length; ++i){
      //for(j=0; j < distances.length; ++j){
        if(distances[tmp[0][0]][i] + distances[i][tmp[0][0]] < dP1)
          console.log("Found an upgrade : passage by " + i);
      //}
    }
    end = true;
  }
  return tmp;
}

const randomMatching = studentIds => shuffle(studentIds);

const computeAv = (tab) => {
  let sum = 0;
  let count = 0;
  for(let i = 0; i < tab.length; ++i){
    for(let j = i+1; j < tab.length; ++j){
      sum += tab[i][j];
      ++count;
    }
  }
  return sum/count;
}

const computeDist = (tab) => {
  let result = [];

  for(let i = 0; i < tab.length; ++i){
    result[i] = [];
    for(let j = 0; j <= i; ++j){
      const tmp = dist(tab[i], tab[j])
      result[i][j] = tmp;
      result[j][i] = tmp;
    }
  }
  return result;
}

const dist = (A, B) => {
  if (A.length != B.length) {
    return -1;
  }
  let count = 0;
  for(let i= 0; i < A.length; ++i){
    count = A[i] != B[i] ? count+1 : count;
  }
  return count;
}

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

//  ({});

export default ({
  id: 'op-argue',
  operator,
  config,
  meta
}: socialOperatorT);
