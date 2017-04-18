// @flow

import type { ObjectT, OperatorPackageT } from 'frog-utils';

export const meta = {
  name: 'Aggregate best ideas',
  type: 'product'
};

export const config = {
  type: 'object',
  properties: {
    anonymize: {
      type: 'boolean',
      title: 'Anonymize contributions?'
    },
    path: {
      type: 'string',
      title: 'JSONPath to text to aggregate'
    }
  }
};

export const operator = (configData: Object, object: ObjectT) => {
  const { products } = object;

  const product = products[0].map(x =>
    x.data.reduce(
      (acc, val) => (val.value.score > acc.score ? val.value : acc),
      { score: -9999, title: 'title', content: 'content' }
    )
  );

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
