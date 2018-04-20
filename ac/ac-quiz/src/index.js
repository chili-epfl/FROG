// @flow

import type { ActivityPackageT } from 'frog-utils';

import { config, validateConfig, configUI } from './config';
import ActivityRunner from './ActivityRunner';
import meta from './meta';
import dashboards from './Dashboard';
import { exportData, formatProduct } from './utils';

const dataStructure = {
  justification: '',
  form: {},
  coordinates: { x: 0, y: 0, valid: false }
};

export default ({
  id: 'ac-quiz',
  type: 'react-component',
  meta,
  config,
  configUI,
  validateConfig,
  dataStructure,
  ActivityRunner,
  dashboards,
  exportData,
  formatProduct
}: ActivityPackageT);
