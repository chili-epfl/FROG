// @flow

import { shuffle, chunk } from 'lodash';
import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Combine groups into larger groups',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  required: ['grouping', 'groupsize', 'strategy', 'globalnum'],
  properties: {
    incomingGrouping: {
      type: 'socialAttribute',
      title: 'Grouping attribute of incoming groups'
    },
    groupnumber: {
      type: 'boolean',
      title: 'Specify desired number of groups, instead of size of groups'
    },
    groupsize: {
      type: 'number',
      title: 'Desired group size (in groups)',
      default: 2
    },
    strategy: {
      default: 'minimum',
      type: 'string',
      title:
        'Group formation strategy, optimize for at least this number of groups in each group (minimum) or no more than this number of groups per group (maximum)?',
      enum: ['minimum', 'maximum']
    },
    globalnum: {
      type: 'number',
      title:
        'Desired number of groups in the class (if you enter 3, and there are only 2 existing groups, there will be only 2 new groups)'
    },
    grouping: {
      type: 'string',
      title: 'Name of social attribute',
      default: 'combinedGroup'
    }
  }
};

export default ({
  id: 'op-combine-groups',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
