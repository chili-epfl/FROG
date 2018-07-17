// @flow

import { type socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Create groups',
  shortDesc: 'Group students randomly',
  description:
    'Create random groups of students, configurable group size and strategy (at least n students, or maximum n students per group).'
};

const config = {
  type: 'object',
  required: ['grouping', 'groupsize', 'strategy', 'globalnum'],
  properties: {
    groupnumber: {
      type: 'boolean',
      title: 'Specify desired number of groups, instead of number of members'
    },
    groupsize: {
      type: 'number',
      title: 'Desired group size',
      default: 3
    },
    strategy: {
      default: 'minimum',
      type: 'string',
      title:
        'Group formation strategy, optimize for at least this number of students in each group (minimum) or no more than this number of students per group (maximum)?',
      enum: ['minimum', 'maximum']
    },
    globalnum: {
      type: 'number',
      title:
        'Desired number of groups in the class (if you enter 3, and there are only 2 students, there will be only 2 groups)'
    },
    grouping: {
      type: 'string',
      title: 'Name of social attribute',
      default: 'group'
    }
  }
};

const configUI = {
  groupsize: { conditional: formdata => !formdata.groupnumber },
  strategy: { conditional: formdata => !formdata.groupnumber },
  globalnum: { conditional: 'groupnumber' }
};

const outputDefinition = conf => [(conf && conf.grouping) || 'group'];

export default ({
  id: 'op-create-groups',
  type: 'social',
  configVersion: 1,
  config,
  configUI,
  meta,
  outputDefinition
}: socialOperatorT);
