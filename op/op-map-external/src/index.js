// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Map external product to student',
  shortDesc: 'External usernames must match FROG usernames',
  description: ''
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-map-external',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
