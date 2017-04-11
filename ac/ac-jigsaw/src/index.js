// @flow

import React from 'react';

import type { ActivityRunnerT, ActivityPackageT } from 'frog-utils';
import { Chat } from 'frog-utils';

import config from './config'
import ActivityRunner from './ActivityRunner'

export const meta = {
  name: 'Jigsaw activity',
  type: 'react-component'
};

export default ({
  id: 'ac-jigsaw',
  ActivityRunner,
  config,
  meta
}: ActivityPackageT);
