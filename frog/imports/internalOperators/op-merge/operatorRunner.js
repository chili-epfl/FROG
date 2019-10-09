// @flow

import {
  type productOperatorRunnerT,
  type activityDataT,
  values
} from '/imports/frog-utils';
import { isEmpty } from 'lodash';

const operator = (
  _,
  { activityData }: { activityData: activityDataT }
): activityDataT => {
  const hasMultipleIn = !activityData.payload;
  // Looks like the type definitions do not handle the way
  // we allow multiple inputs to an operator.
  // $FlowFixMe
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
    // $FlowFixMe
    structure: products[0].structure,
    payload
  };
};

export default (operator: productOperatorRunnerT);
