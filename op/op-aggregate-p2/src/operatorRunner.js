// @flow
import { focusStudent, values, type productOperatorRunnerT } from 'frog-utils';

const operator = (configData, object) => {
  const { socialStructure } = object;
  const groups = Object.keys(socialStructure[configData.grouping]);

  const studentMapping = focusStudent(socialStructure);
  let res = groups.reduce((acc, g) => ({ ...acc, [g]: [] }), {});

  values(object.activityData).forEach(inputProduct => {
    Object.keys(inputProduct.payload).forEach(x => {
      const items = configData.wholeElement
        ? inputProduct.payload[x].data
        : Object.values(inputProduct.payload[x].data);
      const group = studentMapping[x]
        ? studentMapping[x][configData.grouping]
        : x;
      res[group] = [
        ...(res[group] || []),
        ...(configData.wholeElement ? [items] : items)
      ];
    });
  });

  res = Object.keys(res).reduce(
    (acc, x) => ({ ...acc, [x]: { data: res[x], config: {} } }),
    {}
  );
  return { structure: { groupingKey: configData.grouping }, payload: res };
};

export default (operator: productOperatorRunnerT);
