// @flow

import type { ActivityPackageT } from 'frog-utils';

import { config, validateConfig, configUI } from './config';
import ActivityRunner from './ActivityRunner';
import meta from './meta';
import dashboard from './Dashboard';
import { exportData, formatProduct } from './utils';

export default ({
  id: 'ac-quiz',
  type: 'react-component',
  meta,
  config,
  configUI,
  validateConfig,
  ActivityRunner,
  dashboard,
  exportData,
  formatProduct
}: ActivityPackageT);
