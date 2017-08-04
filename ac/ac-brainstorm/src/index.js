// @flow

import { type dataUnitStructT, type ActivityPackageT } from 'frog-utils';

import { config, configUI } from './config';
import meta from './meta';
import ActivityRunner from './ActivityRunner';
import Dashboard from './Dashboard';

const dataStructure = {};

const mergeFunction = (obj: dataUnitStructT, dataFn: Object) => {
  if (obj.data && Array.isArray(obj.data)) {
    obj.data.forEach(box =>
      dataFn.objInsert({ score: box.score || 0, ...box }, box.id)
    );
  }
};

export default ({
  id: 'ac-brainstorm',
  type: 'react-component',
  ActivityRunner,
  Dashboard,
  config,
  configUI,
  meta,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
