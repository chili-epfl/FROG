// @flow

import { type productOperatorRunnerT, values, uuid } from 'frog-utils';
import { isObject } from 'lodash';

const operator = (configData, { activityData }) => {
  let structure = 'all';

  const studentReturns = {};
  values(activityData.payload).forEach(student => {
    if (isObject(student.data)) {
      values(student.data).forEach(item => {
        const ifrom = item.from || item?.li?.liDocument?.payload?.from;

        if (ifrom) {
          let from = '';
          if (typeof ifrom === 'string') {
            structure = 'individual';
            from = ifrom;
          } else {
            structure = { groupingKey: Object.keys(ifrom)[0] };
            from = values(ifrom)[0];
          }
          if (!studentReturns[from]) {
            studentReturns[from] = [item];
          } else {
            studentReturns[from].push(item);
          }
        }
      });
    }
  });

  return {
    structure,
    payload: Object.keys(studentReturns).reduce((acc, x) => {
      acc[x] = {
        data: studentReturns[x].reduce((acc2, item) => {
          const id = uuid();
          return {
            ...acc2,
            [id]: {
              id,
              li: configData.unwrap
                ? item.li.liDocument.payload.reviewId
                : item.li
            }
          };
        }, {})
      };
      return acc;
    }, {})
  };
};

export default (operator: productOperatorRunnerT);
