// @flow

import { type productOperatorT, focusStudent } from 'frog-utils';

const meta = {
  name: 'Aggregate items to p2',
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
    }
  }
};

const operator = (configData, object) => {
  const { socialStructure } = object;
  const groups = Object.keys(socialStructure[configData.grouping]);

  const studentMapping = focusStudent(socialStructure);
  let res = groups.reduce((acc, k) => ({ ...acc, [k]: [] }), {});
  Object.keys(object.activityData.payload).forEach(x => {
    const items = Object.values(object.activityData.payload[x].data);
    const group = studentMapping[x][configData.grouping];
    res[group] = [...res[group], ...items];
  });
  res = Object.keys(res).reduce(
    (acc, x) => ({ ...acc, [x]: { data: res[x] } }),
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
