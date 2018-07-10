// @flow
import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Distribute categorized objects',
  shortName: 'Distribute categorized',
  shortDesc: 'Distribute categorized products objects to instances',
  description: 'Distribute categorized products objects to instances.'
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-distribute-category',
  type: 'product',
  version: 1,
  config,
  meta
}: productOperatorT);
