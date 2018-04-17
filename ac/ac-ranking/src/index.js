// @flow

import { type ActivityPackageT } from 'frog-utils';

import { config, configUI } from './config';
import ActivityRunner from './ActivityRunner';
import dashboards from './Dashboard';
import meta from './meta';

const dataStructure = {
  justification: '',
  answers: {},
  group: {}
};

export default ({
  id: 'ac-ranking',
  type: 'react-component',
  meta,
  config,
  configUI,
  ActivityRunner,
  dashboards,
  dataStructure
}: ActivityPackageT);
