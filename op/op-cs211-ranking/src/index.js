// @flow

import { shuffle, chunk } from 'lodash';
import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Ranking compare CS211',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {}
};

const operator = (configData, object) => {};

export default ({
  id: 'op-cs211-ranking',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
