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

  const distance = (coordA, coordB) =>
    Math.sqrt((coordA.x - coordB.x) ** 2 + (coordA.y - coordB.y) ** 2);

  const distanceMatrix = studentIds.map(A =>
    studentIds.map(B => {
      const coordA = payload[A] && payload[A].data.coordinates;
      const coordB = payload[B] && payload[B].data.coordinates;
      if (!coordA || !coordB) {
        return 0;
      } else {
        return distance(coordA, coordB);
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
