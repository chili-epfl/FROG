// @flow

import type { controlOperatorT } from 'frog-utils';
import { invert } from 'lodash';

import { config, configUI } from './config';

const meta = {
  name: 'Social -> Control',
  shortDesc: 'Maps social attributes to control structures',
  description: ''
};

const calcSingle = (mode, usernames, nameToId) => {
  const userids = usernames.map(x => nameToId(x));
  const payload = userids.reduce((acc, x) => ({ ...acc, [x]: true }), {});
  return { structure: 'individual', mode, payload };
};

const operator = (configData, object) => {
  const nameToId = invert(object.globalStructure.students);
  if (configData.applytoall) {
    return {
      all: calcSingle(
        configData.includeexclude,
        configData.individuals,
        nameToId
      )
    };
  } else {
    return {
      list: configData.rules.reduce(
        (acc, x) => ({
          ...acc,
          [x.activity]: calcSingle(x.mode, x.individuals, nameToId)
        }),
        {}
      )
    };
  }
};

export default ({
  id: 'op-control-group',
  type: 'control',
  operator,
  config,
  configUI,
  meta
}: controlOperatorT);
