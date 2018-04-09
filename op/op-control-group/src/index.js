// @flow

import type { controlOperatorT } from 'frog-utils';
import { invert, compact } from 'lodash';

import { config, configUI } from './config';

const meta = {
  name: 'Social->Control',
  shortDesc: 'Maps social attributes to control structures',
  description: ''
};

const calcSingle = (mode, usernameString, nameToId, individuals, social) => {
  const usernames = usernameString.split(',').map(x => x.trim());
  let userids;
  if (individuals) {
    userids = compact(usernames.map(x => nameToId[x]));
  } else {
    userids = usernames.reduce((acc, x) => [...acc, ...(social[x] || [])], []);
  }
  const payload = userids.reduce((acc, x) => ({ ...acc, [x]: true }), {});
  return { structure: 'individual', mode, payload };
};

const operator = (configData, object) => {
  const nameToId = invert(object.globalStructure.students);
  if (configData.applytoall) {
    return {
      all: calcSingle(
        configData.includeexclude,
        configData.who,
        nameToId,
        configData.individuals,
        object.socialStructure[configData.social]
      )
    };
  } else {
    return {
      list: configData.rules.reduce(
        (acc, x) => ({
          ...acc,
          [x.activity]: calcSingle(
            x.includeexclude,
            x.who,
            nameToId,
            configData.individuals,
            object.socialStructure[configData.social]
          )
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
