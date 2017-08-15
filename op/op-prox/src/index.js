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

  const data: { grpId: string, studentsId: string }[] = payload.all.data.groups;
  const result = data.reduce(
    (acc, x) => ({
      ...acc,
      [x.grpId]: x.studentsId
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
