// @flow

import type { ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';

const meta = {
  name: 'Brainstorm',
  type: 'react-component'
};

export default ({
  id: 'ac-brainstorm',
  ActivityRunner,
  config,
  meta
}: ActivityPackageT);
