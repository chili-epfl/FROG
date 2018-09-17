// @flow

import { type productOperatorRunnerT, uuid } from 'frog-utils';
import { shuffle } from 'lodash';

const createLI = (item, litype, from) => {
  const id = uuid();
  return {
    [id]: {
      id,
      li: {
        id: uuid(),
        liDocument: {
          liType: 'li-peerReview',
          createdAt: new Date(),
          createdBy: 'op-distrib-peer-review',
          payload: {
            reviewItem: item.data,
            reviewComponentLIType: litype,
            reviewId: undefined,
            from
          }
        }
      }
    }
  };
};

const operator = (configData, { activityData }) => {
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
          activityData.payload[shuffledShifted[i]],
          configData.liType || 'li-textarea',
          shuffledShifted[i]
        )
      };
      return acc;
    }, {})
  };
};

export default (operator: productOperatorRunnerT);
