// @flow
import { type socialOperatorRunnerT } from 'frog-utils';

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
      [x]: { config: { [configData.path]: findMatching(x) } }
    }),
    {}
  );
  return {
    structure: { groupingKey: configData.socialAttribute },
    payload: {
      ...payload,
      ...(configData.provideDefault
        ? {
            default: { config: { [configData.path]: configData.defaultValue } }
          }
        : {})
    }
  };
};

export default (operator: socialOperatorRunnerT);
