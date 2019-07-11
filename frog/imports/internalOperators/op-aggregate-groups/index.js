// @flow

import { type productOperatorT } from '/imports/frog-utils';

const meta = {
  name: 'Aggregate from groups to larger groups',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.',
  category: 'Aggregate'
};

const config = {
  type: 'object',
  properties: {
    incomingGrouping: {
      type: 'socialAttribute',
      title: 'Grouping attribute of incoming groups'
    },
    outgoingGrouping: {
      type: 'socialAttribute',
      title: 'Grouping attribute of outgoing groups'
    }
  }
};

export default ({
  id: 'op-aggregate-groups',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
