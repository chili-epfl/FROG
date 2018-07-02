// @flow

import type { controlOperatorT } from 'frog-utils';

import { config, configUI } from './config';

const meta = {
  name: 'Social->Control',
  shortDesc: 'Maps social attributes to control structures',
  description: ''
};

export default ({
  id: 'op-control-group',
  type: 'control',
  config,
  configUI,
  meta
}: controlOperatorT);
