// @flow

import type { controlOperatorT } from '/imports/frog-utils';

import { config, configUI, validateConfig } from './config';

const meta = {
  name: 'Quiz->Control',
  shortDesc: 'Controls participation in activities based on quiz answers',
  description: 'Controls participation in activities based on quiz answers',
  category: 'Control'
};

export default ({
  id: 'op-control-quiz',
  type: 'control',
  configVersion: 1,
  config,
  configUI,
  meta,
  validateConfig
}: controlOperatorT);
