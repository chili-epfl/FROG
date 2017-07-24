// @flow

import type { ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';

export const meta = {
  name: 'Multiple-Choice Questions',
  type: 'react-component',
  shortDesc: 'Filling a MCQ form',
  description: 'Display a multiple-choice questions form.'
};

export default ({
  id: 'ac-quiz',
  meta,
  config,
  ActivityRunner
}: ActivityPackageT);
