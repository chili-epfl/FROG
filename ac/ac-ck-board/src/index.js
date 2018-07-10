// @flow

import { type ActivityPackageT, uuid, values } from 'frog-utils';
import { isObject } from 'lodash';

import { meta, config, configUI } from './meta';

const dataStructure = {};

const mergeFunction = (obj: any, dataFn: any) => {
  if (isObject(obj?.data)) {
    values(obj.data).forEach(x => {
      const id = uuid();
      dataFn.objInsert(
        {
          x: Math.random() * 650 + 150,
          y: -(Math.random() * 850) - 100,
          ...x,
          id
        },
        id
      );
    });
  }
};

export default ({
  id: 'ac-ck-board',
  type: 'react-component',
  version: 1,
  meta,
  config,
  configUI,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
