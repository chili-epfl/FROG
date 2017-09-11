// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import Board from './board';
import { meta, config, configUI } from './meta';

const dataStructure = [];

const mergeFunction = (object, dataFn) => {
  [...(object.config.boxes || []), ...(object.data || [])].forEach(box => {
    if (!box.id) {
      box.id = uuid();
    }
    if (box.title && box.content) {
      dataFn.listAppend({
        ...box,
        x: Math.random() * 400,
        y: Math.random() * 400
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
