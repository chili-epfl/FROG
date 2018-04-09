// @flow

import { type ActivityPackageT } from 'frog-utils';

import { config } from './config';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';
import meta from './meta';

const dataStructure = {
  justification: '',
  answers: {}
};

export default ({
  id: 'ac-ranking',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure
}: ActivityPackageT);
