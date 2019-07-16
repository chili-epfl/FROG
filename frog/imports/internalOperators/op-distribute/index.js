// @flow

import { type productOperatorT } from '/imports/frog-utils';

const meta = {
  name: 'Distribute content',
  shortDesc: 'Distribute list items',
  description:
    'Distribute list items to groups or individual students, with configurable numbers of items per group, overlap allowed or not, etc.',
  category: 'Distribute'
};

const config = {
  type: 'object',
  properties: {
    individual: {
      type: 'boolean',
      title: 'Distribute to each student'
    },
    grouping: {
      type: 'socialAttribute',
      title: 'Grouping attribute'
    },
    maxitems: {
      type: 'number',
      title: 'Max number of items per group'
    },
    overlap: {
      type: 'boolean',
      title: 'Allow multiple groups receiving the same item?'
    },
    duplicateLIs: {
      type: 'boolean',
      title:
        'Duplicate Learning Items instead of letting multiple groups see the same Learning Items'
    }
  }
};

const validateConfig = [
  formData =>
    !formData.individual && !formData.grouping
      ? {
          err:
            'If you want to distribute to groups, you need groupingKey, otherwise select distributing to individuals'
        }
      : null
];

const configUI = {
  grouping: { conditional: formData => !formData.individual }
};

export default ({
  id: 'op-distribute',
  type: 'product',
  configVersion: 1,
  config,
  meta,
  configUI,
  validateConfig
}: productOperatorT);
