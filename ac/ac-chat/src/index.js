// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './Chat';
import Dashboard from './Dashboard';
import meta from './meta';

const dataStructure = [];

const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    }
  }
};

const mergeFunction = (obj, dataFn) => {
  obj.data.forEach(x => dataFn.listAppend(x));
};

export default ({
  id: 'ac-chat',
  ActivityRunner,
  config,
  meta,
  dataStructure,
  Dashboard,
  mergeFunction
}: ActivityPackageT);
