// @flow

import type {
  productOperatorT,
  values,
  entries,
  wrapUnitAll
} from 'frog-utils';

const meta = {
  name: 'Ranking compare CS211',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  required: ['individual', 'group', 'groupData'],
  properties: {
    individual: { type: 'activity', title: 'Individual classification' },
    group: { type: 'activity', title: 'Group classification' },
    groupData: { type: 'activity', title: 'Group classification with data' }
  }
};

const operator = (configData, object) => {
  const first = object.activityData[configData.individual];
  if (!first) {
    throw 'No individual activity data';
  }

  console.log(
    values(first).map(x => x.data && x.data.answers && entries(x.data.answers))
  );
  return wrapUnitAll({}, {});
};

export default ({ operator, config, meta }: productOperatorT);
