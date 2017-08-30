// @flow

import { shuffle, chunk } from 'lodash';
import type { controlOperatorT } from 'frog-utils';

const meta = {
  name: 'Social -> Control',
  shortDesc: 'Maps social attributes to control structures',
  description: ''
};

const config = {
  type: 'object',
  properties: {}
};

const operator = (configData, object) => {};

export default ({
  id: 'op-control-group',
  type: 'control',
  operator,
  config,
  meta
}: controlOperatorT);
