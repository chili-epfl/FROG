// @flow

import type { ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';
import Dashboard from './Dashboard';

const meta = {
  name: 'Brainstorm',
  type: 'react-component'
};

const dataStructure = {
  ideas: {},
  config: {}
};

const mergeFunction = (object, dataFn) => {
  // object.boxes.map(box =>
  //   dataFn.listAppend({
  //     ...box,
  //     x: Math.random() * 800,
  //     y: Math.random() * 800
  //   })
  // );
};

export default ({
  id: 'ac-brainstorm',
  ActivityRunner,
  Dashboard,
  config,
  meta,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
