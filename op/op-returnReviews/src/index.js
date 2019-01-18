// @flow

import { shuffle, chunk } from 'lodash';
import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Return reviews',
  shortDesc:
    'Sends reviews back to the group/student who created the original item',
  description: ''
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-returnReviews',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
