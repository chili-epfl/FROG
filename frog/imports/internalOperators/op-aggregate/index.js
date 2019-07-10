// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Aggregate items',
  shortName: 'Aggregate',
  shortDesc: 'Aggregate items from groups',
  description: 'Optionally selecting the top n items by score',
  category: 'Aggregate'
};

const config = {
  type: 'object',
  properties: {
    chooseTop: { type: 'boolean', title: 'Select top n items by score?' },
    topN: { type: 'number', title: 'n', default: 2 },
    unique: {
      type: 'boolean',
      title: 'When multiple groups send the same item, only forward one of them'
    },
    countScore: {
      type: 'boolean',
      title: 'Add a score field, counting how many instances were forwarded'
    },
    sumScore: {
      type: 'boolean',
      title:
        'Incoming has score field, outgoing has sum of scores for each item'
    }
  }
};

const configUI = {
  topN: { conditional: 'chooseTop' },
  countScore: {
    conditional: formData => formData.unique && !formData.sumScore
  },
  sumScore: { conditional: formData => formData.unique && !formData.countScore }
};

export default ({
  id: 'op-aggregate',
  type: 'product',
  configVersion: 1,
  config,
  configUI,
  meta
}: productOperatorT);
