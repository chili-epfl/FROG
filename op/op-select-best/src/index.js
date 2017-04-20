// @flow

import { flatMap } from 'lodash';
import type { ObjectT, OperatorPackageT } from 'frog-utils';

export const meta = {
  name: 'Aggregate best ideas',
  type: 'product'
};

export const config = {
  type: 'object',
  properties: {
    n: {
      type: 'number',
      title: 'Number of idea per group'
    }
  }
};

export const operator = (configData: Object, object: ObjectT) => {
  const product = flatMap(object.products[0], x =>
    x.data
      .sort((a, b) => a.value.score < b.value.score)
      .slice(0, (configData && configData.n) || 1)
      .map(y => y.value));
  return {
    product,
    socialStructure: {}
  };
};

export default ({
  id: 'op-select-best',
  operator,
  config,
  meta
}: OperatorPackageT);
