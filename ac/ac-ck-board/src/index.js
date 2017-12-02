// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import Board from './board';
import { meta, config, configUI } from './meta';

const dataStructure = [];

const mergeFunction = (object, dataFn) => {
  [...(object.config.boxes || []), ...(object.data || [])].forEach(box => {
    if (box.title) {
      dataFn.listAppend({
        id: uuid(),
        x: Math.random() * 800,
        y: -(Math.random() * 800),
        ...box
      });
    }
  });
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
