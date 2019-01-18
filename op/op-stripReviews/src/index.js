// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Strip review content',
  shortDesc:
    'Unwrap review items, and return only the reviews (not the item to be reviewed)',
  description: ''
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-stripReviews',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
