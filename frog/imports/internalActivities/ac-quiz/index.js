// @flow

import type { ActivityPackageT } from '/imports/frog-utils';

import { config, validateConfig, configUI } from './config';
import meta from './meta';
import upgradeFunctions from './upgradeFunctions';
import dashboards from './Dashboard';
import { exportData, formatProduct } from './utils';

const dataStructure = formData => ({
  justification: '',
  form: formData.questions.reduce((acc, _, questionIndex) => {
    acc[questionIndex] = { text: '' };
    return acc;
  }, {}),
  coordinates: { x: 0, y: 0, valid: false }
});

const mergeFunction = (object, dataFn) => {
  if (object.data && object.data.form) {
    dataFn.objInsert(object.data.form, 'form');
  }
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
  formatProduct,
  mergeFunction
}: ActivityPackageT);
