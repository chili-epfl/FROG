// @flow
import { type productOperatorT } from '/imports/frog-utils';

const meta = {
  name: 'Distribute categorized objects',
  shortName: 'Distribute categorized',
  shortDesc: 'Distribute categorized products objects to instances',
  description: 'Distribute categorized products objects to instances.',
  category: 'Distribute'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-distribute-category',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
