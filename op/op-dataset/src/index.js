// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Dataset from quiz data',
  shortDesc: 'Creates dataset for ac-stat from quiz data',
  description: 'Creates dataset for ac-stat from quiz data'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-dataset',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
