// @flow

import type { ActivityPackageT } from 'frog-utils';

import { config, validateConfig } from './config';
import ActivityRunner from './ActivityRunner';
import meta from './meta';
import dashboard from './Dashboard';
import { exportData, formatProduct } from './utils';

const dataStructure = {
  progress: 0,
  score: 0,
  time: 0
};

export default ({
  id: 'ac-timedQuiz',
  type: 'react-component',
  meta,
  config,
  validateConfig,
  ActivityRunner,
  dashboard,
  exportData,
  dataStructure,
  formatProduct
}: ActivityPackageT);
