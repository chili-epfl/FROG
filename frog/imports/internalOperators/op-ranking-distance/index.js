// @flow

import { type productOperatorT } from '/imports/frog-utils';

const meta = {
  name: 'Distance from rankings',
  shortDesc: 'Distance from rankings',
  description: 'Distance from rankings',
  category: 'Other'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-ranking-distance',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
