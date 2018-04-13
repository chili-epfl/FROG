// @flow

import { type socialOperatorT, getSlug } from 'frog-utils';

const meta = {
  name: 'Proximity',
  shortDesc: 'After a proximity activity',
  description:
    'Group students depending on what they entered in the proximity activity before.'
};

const config = {};

const operator = (configData, object) => {
  const {
    activityData: { structure, payload }
  } = object;
  if (structure !== 'all') throw 'The structure needs to be all';

  const data: { [string]: string } = payload.all.data.students;
  const studentList = Object.keys(data);
  const result = studentList.reduce(
    (acc, studentId) => ({
      ...acc,
      [data[studentId]]: [...(acc[data[studentId]] || []), studentId]
    }),
    {}
  );

  let groupingValue = getSlug(4);
  result[groupingValue] = [];
  let count = 0;
  object.globalStructure.studentIds.forEach(studentId => {
    if (!studentList.includes(studentId)) {
      if (count > 0) {
        groupingValue = getSlug(4);
        result[groupingValue] = [];
        count = 0;
      }
      result[groupingValue].push(studentId);
      count += 1;
    }
  });
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
