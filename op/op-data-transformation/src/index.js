// @flow

import { shuffle, chunk } from 'lodash';
import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Id-indexed object to item array',
  shortDesc: 'Transforms an id-indexed object, to an item array',
  description: '',
  types: {
    incoming: { Id: 'any-1' },
    outgoing: ['any-1']
  }
};

const config = {
  type: 'object',
  properties: {}
};

const operator = (configData, object) => {
  return Object.values(object);
};

export default ({
  id: 'op-data-transformation',
  type: 'product',
  subtype: 'aggregation',
  operator,
  config,
  meta
}: productOperatorT);
