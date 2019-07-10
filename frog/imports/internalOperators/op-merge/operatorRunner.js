// @flow

import { type productOperatorRunnerT, values } from 'frog-utils';
import { isEmpty } from 'lodash';

const operator = (_, { activityData }) => {
  const hasMultipleIn = !activityData.payload;
  const products = hasMultipleIn ? values(activityData) : [activityData];
  const arrayProd = products.reduce((acc, x) => {
    Object.keys(x.payload).forEach(i => {
      if (!isEmpty(x.payload[i].data)) {
        if (!acc[i]) {
          acc[i] = [];
        }
        acc[i].push(x.payload[i]);
      }
    });
    return acc;
  }, {});
  const payload = Object.keys(arrayProd).reduce((acc, x) => {
    const c =
      arrayProd[x].find(item => !isEmpty(item?.data?.answers)) ||
      arrayProd[x][0];
    acc[x] = c;
    return acc;
  }, {});
  return {
    structure: products[0].structure,
    payload
  };
};

export default (operator: productOperatorRunnerT);
