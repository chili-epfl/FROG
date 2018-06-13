// @flow

import { type ActivityPackageT, uuid, values } from 'frog-utils';
import { isObject } from 'lodash';

import Board from './board';
import { meta, config, configUI } from './meta';

const dataStructure = {};

// from top left to bottom right, x, y
// quadrant: 132, 369
// 824, 1261
//
// qx 132-824
// qy 369-1261
//
// bx 131-828
// by -970--78
//
// board: 131, -970
// board: 828, -78

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
  meta,
  config,
  configUI,
  ActivityRunner: Board,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
