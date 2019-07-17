// @flow

import type { productOperatorT } from '/imports/frog-utils';

const meta = {
  name: 'Distribute to other individuals or other groups',
  shortDesc: 'Round-robin distributes within a single plane',
  description: '',
  category: 'Distribute'
};

const config = {
  type: 'object',
  properties: {
    count: {
      title: 'How many items to send to each recipient?',
      type: 'number',
      default: 1
    },
    offset: { title: 'Offset', type: 'number', default: 0 }
  }
};

const validateConfig = [
  formData =>
    !Number.isInteger(formData.count)
      ? { err: 'Number of items must be an integer' }
      : null,
  formData =>
    formData.count < 1 ? { err: 'Number of items must be above 0' } : null
];

export default ({
  id: 'op-distrib-round-robin',
  type: 'product',
  configVersion: 1,
  config,
  validateConfig,
  meta
}: productOperatorT);
