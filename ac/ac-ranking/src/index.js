// @flow

import { type dataUnitStructT, type ActivityPackageT } from 'frog-utils';

import { config } from './config';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';
import meta from './meta';

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {
  justification: '',
  rankedAnswers: {},
  initialAnswers: []
};

const mergeFunction = (obj: dataUnitStructT, dataFn: Object) => {
  if (obj.data && Array.isArray(obj.data)) {
    obj.data.forEach(box => {
      dataFn.objInsert({ rank: 0, ...box }, ['rankedAnswers', box.id]);
    });
  }
  if (obj.config.answers && Array.isArray(obj.config.answers)) {
    obj.config.answers.forEach(ans => {
      dataFn.listAppend(ans.choice, ['initialAnswers']);
    });
  }
};

export default ({
  id: 'ac-ranking',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
