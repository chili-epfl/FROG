// @flow

import { type socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Proximity',
  shortDesc: 'After a proximity activity',
  description:
    'Group students depending on what they entered in the proximity activity before.'
};

const config = {};

export default ({
  id: 'op-prox',
  type: 'social',
  configVersion: 1,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
