// @flow

import type { ActivityPackageT } from 'frog-utils';

import { config, validateConfig, configUI } from './config';
import meta from './meta';
import upgradeFunctions from './upgradeFunctions';
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
  configVersion: 1,
  upgradeFunctions,
  meta,
  config,
  configUI,
  validateConfig,
  dataStructure,
  dashboards,
  exportData,
  formatProduct
}: ActivityPackageT);
