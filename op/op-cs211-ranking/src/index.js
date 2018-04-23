// @flow

import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Ranking compare CS211',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

export const config = {
  type: 'object',
  required: ['individual', 'group', 'groupData'],
  properties: {
    individual: { type: 'activity', title: 'Individual classification' },
    group: { type: 'activity', title: 'Group classification' },
    groupData: { type: 'activity', title: 'Group classification with data' }
  }
};

const operator = (configData, object) => {};

export default ({
  id: 'op-cs211-ranking',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);

const object = {
  activityData: {
    cjgcb9q6y0003jvj44nqjprg6: { structure: 'all', payload: [Object] },
    cjgcb9q6y0002jvj4bvmm8xdc: { structure: 'all', payload: [Object] }
  },
  socialStructure: {},
  globalStructure: {
    studentIds: ['udfypgRAzePTYZazW'],
    students: { udfypgRAzePTYZazW: 'teacher' }
  }
};
