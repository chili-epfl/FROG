// @flow

import { type productOperatorT } from '/imports/frog-utils';

const meta = {
  name: 'Select top n items by score',
  shortDesc: 'Works for all social structures',
  description: '',
  category: 'Other'
};

const config = {
  type: 'object',
  properties: {
    topN: { title: 'Select top N items', type: 'number', default: 1 }
  }
};

export default ({
  id: 'op-select-best',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
