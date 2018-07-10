// @flow

import { type socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Argue (with constraints)',
  shortDesc: 'Group students to argue',
  description: 'Group students with as few similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {
    grouping: {
      type: 'socialAttribute',
      title: 'Grouping attribute'
    },
    matching: {
      type: 'string',
      title: 'What group pairs are ok? example "1,1;2,3;3,2;4,4"'
    }
  }
};

export default ({
  id: 'op-argue-constraint',
  type: 'social',
  version: 1,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
