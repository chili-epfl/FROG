// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import Board from './board';
import meta from './meta';
import config from './config';

const dataStructure = [];

const mergeFunction = (object, dataFn) => {
  [...(object.config.boxes || []), ...object.data].forEach(box => {
    if (!box.id) {
      box.id = uuid();
    }
    return dataFn.listAppend({
      ...box,
      x: Math.random() * 400,
      y: Math.random() * 400
    });
  });
};

export default ({
  id: 'ac-ck-board',
  meta,
  config,
  ActivityRunner: Board,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
