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

const formatProduct = (_: Object, item: Object) => {
  const n = values(item).length;
  if (n === 0) {
    return { ...item };
  }
  const coordinates = values(item).reduce(
    (acc, { x, y }) => ({ x: acc.x + x / n, y: acc.y + y / n }),
    { x: 0, y: 0 }
  );
  return {
    ...item,
    coordinates
  };
};

export default ({
  id: 'ac-ck-board',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  configUI,
  formatProduct,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
