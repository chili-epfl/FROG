// @flow
import { invert, compact } from 'lodash';
import { type controlOperatorRunnerT } from '/imports/frog-utils';

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
  console.log(configData);
  console.log(object);

  const nameToId = invert(object.globalStructure.students);
  if (configData.applytoall) {
    const toRet = {
      all: calcSingle(
        configData.includeexclude,
        configData.who,
        nameToId,
        configData.individuals,
        object.socialStructure[configData.social]
      )
    };
    console.log(toRet);
    return toRet;
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

export default (operator: controlOperatorRunnerT);
