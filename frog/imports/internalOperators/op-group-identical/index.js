// @flow

import type { socialOperatorT } from '/imports/frog-utils';

const meta = {
  name: 'Group based on identical student data',
  shortName: 'Group identical',
  shortDesc: 'Group identical students together',
  description: 'Group students with as many similar answers as possible',
  category: 'Deprecated'
};

const config = {
  type: 'object',
  properties: {
    old: {
      type: 'socialAttribute',
      title: 'Rotate old groups'
    }
  }
};

export default ({
  id: 'op-group-identical',
  type: 'social',
  configVersion: 1,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
