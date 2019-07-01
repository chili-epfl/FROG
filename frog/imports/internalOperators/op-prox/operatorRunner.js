// @flow
import { getSlug, type socialOperatorRunnerT } from 'frog-utils';

const operator = (configData: *, object: *) => {
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
  if (result[groupingValue].length === 0) {
    delete result[groupingValue];
  }
  return { group: result };
};

export default (operator: socialOperatorRunnerT);
