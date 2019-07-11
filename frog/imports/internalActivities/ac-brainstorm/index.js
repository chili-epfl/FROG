// @flow

import { type ActivityPackageT, uuid, values } from '/imports//imports/frog-utils';
import { isObject, isEmpty } from 'lodash';
import upgradeFunctions from './upgradeFunctions';

import { config, configUI } from './config';
import meta from './meta';

const dataStructure = {};

const mergeFunction = (object, dataFn) => {
  if (isEmpty(object.data) || !isObject(object.data)) {
    return;
  }
  values(object.data).forEach(v => {
    if (v.li) {
      const id = uuid();
      dataFn.objInsert(
        {
          students: {},
          score: 0,
          ...v,
          id
        },
        id
      );
    }
  });
};

export default ({
  id: 'ac-brainstorm',
  type: 'react-component',
  configVersion: 2,
  config,
  configUI,
  meta,
  dataStructure,
  mergeFunction,
  upgradeFunctions
}: ActivityPackageT);
