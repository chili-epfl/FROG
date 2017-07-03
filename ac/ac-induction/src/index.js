// @flow

import React from 'react';
import ActivityRunner from './Induction';
import { type ActivityPackageT, uuid } from 'frog-utils';
import config from './config'

const meta = {
  name: 'Induction',
  type: 'react-component'
};

export default ({
  id: 'ac-induction',
  meta,
  config,
  ActivityRunner,
  Dashboard: null
}: ActivityPackageT);
