// @flow

import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Filter',
  shortDesc: 'Filter list of products.',
  description: 'Filter list of products.'
};

const config = {
  type: 'object',
  properties: {
    field: {
      type: 'string',
      title: 'Filtering field'
    },
    value: {
      type: 'string',
      title: 'Filtering value (leave empty for testing with booleans)'
    },
    remove: {
      type: 'boolean',
      title: 'Remove matching objects?'
    },
    removeUndefined: {
      type: 'boolean',
      title: 'Remove object which do not have the required field?'
    }
  }
};

export default ({
  id: 'op-filter',
  type: 'product',
  version: 1,
  config,
  meta
}: productOperatorT);
