// @flow

import { type productOperatorT } from '/imports/frog-utils';

const meta = {
  name: 'Merge multiple inputs',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.',
  category: 'Specialized'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-merge',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
