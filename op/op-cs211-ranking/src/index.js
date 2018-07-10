// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Ranking compare CS211',
  shortDesc: 'Make change matrix based upon rankings',
  description: 'Make change matrix based upon changed rankings'
};

const config = {
  type: 'object',
  required: ['individual', 'group', 'groupData'],
  properties: {
    individual: { type: 'sourceActivity', title: 'Individual classification' },
    group: { type: 'sourceActivity', title: 'Group classification' },
    groupData: {
      type: 'sourceActivity',
      title: 'Group classification with data'
    }
  }
};

export default ({
  id: 'op-cs211-ranking',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
