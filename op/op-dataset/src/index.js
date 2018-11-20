// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Dataset from quiz data',
  shortDesc: 'Creates dataset for ac-stat from quiz data',
  description: 'Creates dataset for ac-stat from quiz data'
};

const config = {
  type: 'object',
  properties: {
    primary: {
      type: 'number',
      title: 'Index of quiz question for the primary data (index starts at 0)'
    },
    secondary: {
      type: 'number',
      title:
        'Index of quiz question for the secondary data (can be left empty, must be categorical)'
    },
    filterMin: {
      type: 'number',
      title: 'Filter values less than (can be left empty)'
    },
    filterMax: {
      type: 'number',
      title: 'Filter values more than (can be left empty)'
    }
  }
};

export default ({
  id: 'op-dataset',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
