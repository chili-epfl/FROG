// @flow

import type { dataUnitStructT, ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';
import Dashboard from './Dashboard';

const meta = {
  name: 'Brainstorm',
  type: 'react-component'
};

const dataStructure = []

const mergeFunction = (obj: dataUnitStructT, dataFn: Object) => {
  if(obj.data) {
  obj.data.map(box =>
    dataFn.listAppend({
      ...box,
      x: Math.random() * 800,
      y: Math.random() * 800
    })
  );
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
