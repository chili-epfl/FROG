import { focusStudent, values, type productOperatorRunnerT } from 'frog-utils';

const operator = (configData, object) => {
  const { socialStructure, activityData } = object;
  const groups = Object.keys(socialStructure[configData.grouping]);

  const studentMapping = focusStudent(socialStructure);
  const res = groups.reduce((acc, g) => {
    acc[g] = [];
    return acc;
  }, {});

  const hasMultipleIn = !activityData.payload;
  const products = hasMultipleIn ? values(activityData) : [activityData];
  products.forEach(product => {
    Object.keys(product.payload).forEach(x => {
      const items = configData.wholeElement
        ? product.payload[x].data
        : Object.values(product.payload[x].data);
      const group = studentMapping[x]
        ? studentMapping[x][configData.grouping]
        : x;
      res[group] = [
        ...(res[group] || []),
        ...(configData.wholeElement ? [items] : items)
      ];
    });
  });

  const payload = Object.keys(res).reduce((acc, g) => {
    acc[g] = { data: res[g], config: {} };
    return acc;
  }, {});
  return { structure: { groupingKey: configData.grouping }, payload };
};

export default (operator: productOperatorRunnerT);
