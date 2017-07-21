// @flow

import type { ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';

export const meta = {
  name: 'Multiple-Choice Questions',
  type: 'react-component',
  description: 'Display a multiple-choice questions form',
  inputs: '',
  outputs: ''
};

export default ({
  id: 'ac-quiz',
  meta,
  config,
  ActivityRunner
}: ActivityPackageT);
