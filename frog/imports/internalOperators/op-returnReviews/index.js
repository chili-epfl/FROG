// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Return reviews',
  shortDesc:
    'Sends reviews back to the group/student who created the original item',
  description: '',
  category: 'Peer-review'
};

const config = {
  type: 'object',
  properties: {
    includeItem: {
      title: 'Include item to be reviewed',
      type: 'boolean'
    }
  }
};

export default ({
  id: 'op-returnReviews',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
