// @flow

import { type productOperatorRunnerT, values, uuid } from 'frog-utils';
import { isObject } from 'lodash';

const operator = (configData, { activityData }) => {
  if (activityData.structure !== 'individual') {
    console.error('Cannot work with data that is not individually structured');
    throw new Error();
  }

  const studentReturns = {};
  values(activityData.payload).forEach(student => {
    if (isObject(student.data)) {
      values(student.data).forEach(item => {
        if (item.from) {
          if (!studentReturns[item.from]) {
            studentReturns[item.from] = [item];
          } else {
            studentReturns[item.from].push(item);
          }
        }
      });
    }
  });

  return {
    structure: 'individual',
    payload: Object.keys(studentReturns).reduce((acc, x) => {
      acc[x] = {
        data: studentReturns[x].reduce((acc2, item) => {
          const id = uuid();
          acc2[id] = { id, ...item };
          return acc2;
        }, {})
      };
      return acc;
    }, {})
  };
};

export default (operator: productOperatorRunnerT);
