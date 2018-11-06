// @flow

import { type productOperatorRunnerT, uuid } from 'frog-utils';
import { shuffle } from 'lodash';

const createLI = (dataFn, item, litype, from) => {
  const id = uuid();
  const li = dataFn.createLearningItem('li-peerReview', {
    reviewItem: item.data,
    reviewComponentLIType: litype,
    reviewId: undefined,
    from
  });
  return { [id]: { id, li, from } };
};

const operator = (configData, { activityData }, dataFn) => {
  if (activityData.structure !== 'individual') {
    console.error('Cannot work with data that is not individually structured');
    throw new Error();
  }
  const students = Object.keys(activityData.payload);
  const shuffled = shuffle(students);
  const shuffledShifted = [...shuffled];
  shuffledShifted.push(shuffledShifted.shift());
  return {
    structure: 'individual',
    payload: shuffled.reduce((acc, x, i) => {
      acc[x] = {
        data: createLI(
          dataFn,
          activityData.payload[shuffledShifted[i]],
          configData.liType || 'li-textArea',
          shuffledShifted[i]
        )
      };
      return acc;
    }, {})
  };
};

export default (operator: productOperatorRunnerT);
