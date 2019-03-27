// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Aggregate spreadsheet',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-aggregate-spreadsheet',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
