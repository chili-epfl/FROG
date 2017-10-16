// @flow

import type { ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';
import { meta } from './meta';
import dashboard from './Dashboard';

export default ({
  id: 'ac-quiz',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard
}: ActivityPackageT);
