// @flow

import type { ActivityPackageT } from 'frog-utils';

import { config, validateConfig } from './config';
import meta from './meta';
import dashboards from './Dashboard';
import { exportData, formatProduct } from './utils';

const dataStructure = {
  progress: 0,
  score: 0,
  time: 0
};

export default ({
  id: 'ac-timedQuiz',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  validateConfig,
  dashboards,
  exportData,
  dataStructure,
  formatProduct
}: ActivityPackageT);
