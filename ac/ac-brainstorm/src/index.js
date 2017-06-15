// @flow

import { type dataUnitStructT, type ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';
import Dashboard from './Dashboard';

const meta = {
  name: 'Brainstorm',
  type: 'react-component'
};

const dataStructure = {};

const mergeFunction = (obj: dataUnitStructT, dataFn: Object) => {
  if (obj.data) {
    obj.data.forEach(box => dataFn.objInsert({ score: 0, ...box }, box.id));
  }
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
