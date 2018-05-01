// @flow

import { type productOperatorT, focusStudent } from 'frog-utils';

const meta = {
  name: 'Aggregate items to p2',
  shortName: 'Aggregate->p2',
  shortDesc: 'Aggregate items from individuals',
  description: 'Sending to appropriate groups'
};

const config = {
  type: 'object',
  required: ['grouping'],
  properties: {
    grouping: {
      type: 'socialAttribute',
      title: 'Grouping attribute'
    },
    wholeElement: {
      type: 'boolean',
      title: 'Send whole instance data, do not break up into individual values'
    }
  }
};

const operator = (configData, object) => {
  const { socialStructure } = object;
  const groups = Object.keys(socialStructure[configData.grouping]);

  const studentMapping = focusStudent(socialStructure);
  let res = groups.reduce((acc, k) => ({ ...acc, [k]: [] }), {});
  Object.keys(object.activityData.payload).forEach(x => {
    const items = configData.wholeElement
      ? object.activityData.payload[x].data
      : Object.values(object.activityData.payload[x].data);
    const group = studentMapping[x]
      ? studentMapping[x][configData.grouping]
      : x;
    res[group] = [
      ...(res[group] || []),
      ...(configData.wholeElement ? [items] : items)
    ];
  });
  res = Object.keys(res).reduce(
    (acc, x) => ({ ...acc, [x]: { data: res[x], config: {} } }),
    {}
  );
  return { structure: { groupingKey: configData.grouping }, payload: res };
};

export default ({
  id: 'op-aggregate-p2',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
