// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Distance from (x,y) coordinates',
  shortDesc: 'Distance from (x,y) coordinates.',
  description: 'Distance from (x,y) coordinates.'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-xy-distance',
  type: 'product',
  version: 1,
  config,
  meta
}: productOperatorT);
