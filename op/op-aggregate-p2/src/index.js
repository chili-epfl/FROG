// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Aggregate items to p2',
  shortName: 'Aggregate->p2',
  shortDesc: 'Aggregate items from individuals',
  description: 'Sending to appropriate groups'
};

const config = {
  type: 'object',
  required: ['grouping'],
  properties: {
    grouping: {
      type: 'socialAttribute',
      title: 'Grouping attribute'
    },
    wholeElement: {
      type: 'boolean',
      title: 'Send whole instance data, do not break up into individual values'
    }
  }
};

export default ({
  id: 'op-aggregate-p2',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
