// @flow

import type { controlOperatorT } from 'frog-utils';

import { config, configUI } from './config';

const meta = {
  name: 'Social->Control',
  shortDesc: 'Maps social attributes to control structures',
  description: '',
  category: 'Control'
};

export default ({
  id: 'op-control-group',
  type: 'control',
  configVersion: 1,
  config,
  configUI,
  meta
}: controlOperatorT);
