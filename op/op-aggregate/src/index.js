// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Aggregate items',
  shortName: 'Aggregate',
  shortDesc: 'Aggregate items from groups',
  description: 'Optionally selecting the top n items by score'
};

const config = {
  type: 'object',
  properties: {
    chooseTop: { type: 'boolean', title: 'Select top n items by score?' },
    topN: { type: 'number', title: 'n', default: 2 }
  }
};

const configUI = { topN: { conditional: 'chooseTop' } };

export default ({
  id: 'op-aggregate',
  type: 'product',
  config,
  configUI,
  meta
}: productOperatorT);
