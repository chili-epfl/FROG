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
  const { globalStructure, activityData: { structure, payload } } = object;
  if (structure !== 'all') throw 'The structure needs to be all';
  //globalStructure = { studentIds: [ 'ucCssMWSQ4AeTMZFN', 'kCHstxSezurzLoY77' ] }
  //structure = all
  console.log(payload.all.data.groups);
  //payload = { all: { data: { students: [Array], groups: [Array] } } }

  // { group: { '1': [ 'aa ' ], '2': [ 'bb' ] }

  const result = payload.all.data.groups.reduce(
    (acc, x) => ({ ...acc, [x.grpId]: x.studentsId }),
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
