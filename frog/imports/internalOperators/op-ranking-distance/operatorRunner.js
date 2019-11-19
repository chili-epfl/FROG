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

  console.log(payload);
  const distance = (ranksA, ranksB) => 0;

  const distanceMatrix = studentIds.map(A =>
    studentIds.map(B => {
      const ranksA = payload[A] && payload[A].data.ranks;
      const ranksB = payload[B] && payload[B].data.ranks;
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
