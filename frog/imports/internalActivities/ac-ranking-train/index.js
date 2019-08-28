import { type ActivityPackageT } from '/imports/frog-utils';
import { sortBy } from 'lodash';

import { config, configUI } from './config';
import dashboards from './Dashboard';
import meta from './meta';

const dataStructure = {
  answers: [{}, {}],
  group: {},
  round: 0
};

export const formatProduct = (
  _config: Object,
  data: Object,
  instanceId: string
) => {
  const userName = data.group[instanceId];
  const obj = data.answers[1][instanceId];
  const choices = sortBy(Object.keys(obj || {}), k => obj[k]).join(', ');

  let msg;
  if (userName && choices) {
    msg = `${userName} ranked the interfaces in the following order: ${choices}`;
  } else if (userName) {
    msg = `${userName} has not ranked the interfaces.`;
  } else {
    msg =
      'Uh Oh !! The student assigned to work with you has not completed the previous activity. If he still does not participate, you could discuss with your fellow student sitting next to you.';
  }

  return { ...data, msg, answers: data.answers[1] };
};

export default ({
  id: 'ac-ranking-train',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  configUI,
  dashboards,
  dataStructure,
  formatProduct
}: ActivityPackageT);
