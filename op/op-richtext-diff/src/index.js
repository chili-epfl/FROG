// @flow

import { shuffle, chunk } from 'lodash';
import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Rich text diff',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-richtext-diff',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
