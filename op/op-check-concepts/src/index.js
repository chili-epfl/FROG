// @flow

import { shuffle, chunk } from 'lodash';
import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Provide feedback based on concepts in text',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {}
};

const operator = (configData, object) => {};

export default ({
  id: 'op-check-concepts',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
