// @flow
import { type productOperatorRunnerT } from '/imports/frog-utils';

const operator = (configData, object) => {
  const findMatching = attrib => {
    const matching = configData.matchings.find(x => x.socialValue === attrib);
    if (matching) {
      return matching.configValue;
    }
    if (configData.provideDefault) {
      return configData.defaultValue;
    } else {
      return null;
    }
  };
  const payload = Object.keys(
    object.socialStructure[configData.socialAttribute]
  ).reduce(
    (acc, x) => ({
      ...acc,
      [x]: { config: { [configData.path]: findMatching(x) }, data: null }
    }),
    {}
  );
  return {
    structure: { groupingKey: configData.socialAttribute },
    payload: {
      ...payload,
      ...(configData.provideDefault
        ? {
            default: {
              config: { [configData.path]: configData.defaultValue },
              data: null
            }
          }
        : {})
    }
  };
};

export default (operator: productOperatorRunnerT);
