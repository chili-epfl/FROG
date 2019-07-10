// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Distance from (x,y) coordinates',
  shortDesc: 'Distance from (x,y) coordinates.',
  description: 'Distance from (x,y) coordinates.',
  category: 'Other'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-xy-distance',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
