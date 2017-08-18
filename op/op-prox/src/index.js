// @flow

import type { socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Proximity',
  shortDesc: 'After a proximity activity',
  description:
    'Group students depending on what they entered in the proximity activity before.'
};

const config = {
  type: 'object',
  properties: {}
};

const operator = (configData, object) => {
  const { activityData: { structure, payload } } = object;
  if (structure !== 'all') throw 'The structure needs to be all';

  const data: { [string]: string } = payload.all.data.students;
  const result = Object.keys(data).reduce(
    (acc, studentId) => ({
      ...acc,
      [data[studentId]]: [...(acc[data[studentId]] || []), studentId]
    }),
    {}
  );
  return { group: result };
};

export default ({
  id: 'op-prox',
  type: 'social',
  operator,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
