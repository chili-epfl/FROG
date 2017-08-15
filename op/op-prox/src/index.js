// @flow

import type { socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Proximity',
  shortDesc: 'After a proximity activity',
  description: 'Group students depending on what they entered in the proximity activity before.'
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

  const result = { group: {} };
  const grps = payload.all.data.groups;
  grps.map((x,i) => result.group[(i + 1).toString()] = x.studentIds);
  return result;
};

export default ({
  id: 'op-prox',
  type: 'social',
  operator,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
