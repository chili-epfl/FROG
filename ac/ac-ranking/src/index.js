// @flow

import { type ActivityPackageT } from 'frog-utils';
import { toPairs, sortBy } from 'lodash';

import { config, configUI } from './config';
import ActivityRunner from './ActivityRunner';
import dashboards from './Dashboard';
import meta from './meta';

const dataStructure = {
  justification: '',
  answers: {},
  group: {}
};

export const formatProduct = (
  _config: Object,
  data: Object,
  instanceId: string
) => {
  const userName = data.group[instanceId];
  const choices = sortBy(toPairs(data.answers[instanceId] || {}), x => x[1])
    .map(x => x[0])
    .join(', ');

  return {
    ...data,
    msg: `${userName} ranked the interfaces in the following order: ${choices}, with the justification "${
      data.justification
    }".`
  };
};

export default ({
  id: 'ac-ranking',
  type: 'react-component',
  meta,
  config,
  configUI,
  ActivityRunner,
  dashboards,
  dataStructure,
  formatProduct
}: ActivityPackageT);
