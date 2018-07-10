// @flow

import type { ActivityPackageT } from 'frog-utils';
import ConfigComponent from './config.js';

export const meta = {
  name: 'Dashboard activity',
  shortDesc: 'Show a dashboard from a previous activity',
  description:
    'Show a dashboard from a previous activity. This is often useful for debriefing',
  preview: false
};

export default ({
  id: 'ac-dash',
  type: 'react-component',
  version: 1,
  config: {},
  ConfigComponent,
  meta
}: ActivityPackageT);
