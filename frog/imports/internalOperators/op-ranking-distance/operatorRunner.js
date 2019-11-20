// @flow
import {
  type productOperatorRunnerT,
  type activityDataT
} from '/imports/frog-utils';

const operator = (_, object) => {
  const {
    activityData: { payload },
    globalStructure: { studentIds }
  } = object;

  // we compute the distance between two students as the sum
  // of square differences between their assigned ranks
  const distance = (a, b) =>
    Object.keys(a).reduce(
      (d, key) => (b[key] ? d + (b[key] - a[key]) ** 2 : d),
      0
    );

  const distanceMatrix = studentIds.map(A =>
    studentIds.map(B => {
      const answersA = payload[A] && payload[A].data.answers;
      const answersB = payload[B] && payload[B].data.answers;
      const ranksA = answersA && answersA[A];
      const ranksB = answersB && answersB[B];
      if (!ranksA || !ranksB) {
        return 0;
      } else {
        return distance(ranksA, ranksB);
      }
    })
  );

  const toReturn: activityDataT = {
    structure: 'all',
    payload: { all: { data: { distanceMatrix }, config: {} } }
  };

  return toReturn;
};

export default (operator: productOperatorRunnerT);
