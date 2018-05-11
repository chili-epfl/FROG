// @flow

import { type ActivityPackageT } from 'frog-utils';
import { sortBy } from 'lodash';

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
  const obj = data.answers[instanceId];
  const choices = sortBy(Object.keys(obj || {}), k => obj[k]).join(', ');

  let msg;
  if (userName && choices) {
    msg = `${userName} ranked the interfaces in the following order: ${choices}`;
    if (data.justification) {
      msg += `, with the justification "${data.justification}".`;
    } else {
      msg += ', with no justification.';
    }
  } else if (userName) {
    msg = `${userName} has not ranked the interfaces.`;
  } else {
    msg =
      'Uh Oh !! The student assigned to work with you has not completed the previous activity. If he still does not participate, you could discuss with your fellow student sitting next to you.';
  }

  return { ...data, msg };
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
