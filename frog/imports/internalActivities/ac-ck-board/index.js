// @flow

import { type ActivityPackageT, uuid, values } from '/imports/frog-utils';
import { isObject } from 'lodash';

import { meta, config, configUI } from './meta';
import upgradeFunctions from './upgradeFunctions';

const dataStructure = {};

const mergeFunction = (obj: any, dataFn: any) => {
  if (isObject(obj?.data)) {
    values(obj.data).forEach(x => {
      const id = uuid();
      dataFn.objInsert(
        {
          coords: [Math.random() * 650 + 150, -(Math.random() * 850) - 100],
          ...x,
          id
        },
        id
      );
    });
  }
};

const getQuadrant = ([x, y]) => {
  if (x > 650) {
    if (y > -450) {
      return 4;
    } else {
      return 2;
    }
  } else if (y > -450) {
    return 3;
  } else {
    return 1;
  }
};

const formatProduct = (configData: Object, item: Object) => {
  const n = values(item).length;
  if (n === 0) {
    return { ...item };
  }
  if (configData.quadrants) {
    values(item).forEach(x => {
      x.quadrant = getQuadrant(x.coords) + '';
    });
  }
  const coordinates = values(item).reduce(
    (acc, { coords }) => ({
      x: acc.x + coords[0] / n,
      y: acc.y + coords[1] / n
    }),
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
  configVersion: 2,
  upgradeFunctions,
  meta,
  config,
  configUI,
  formatProduct,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
