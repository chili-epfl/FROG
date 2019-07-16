// @flow
import { focusRole, type socialOperatorRunnerT } from '/imports/frog-utils';

const operator = (
  configData,
  { globalStructure: { studentIds, students } }
) => {
  const defaultMapping = configData.defaultGroupingValues
    .split(',')
    .map(f => f.trim());
  const studentmapping = configData.studentmapping
    .split('\n')
    .filter(x => x.trim() !== '')
    .reduce((acc, x) => {
      const f = x.split(',');
      return { ...acc, [f[0]]: f.slice(1).map(z => z.trim()) };
    }, {});
  const groupingKeys = configData.groupingKeys.split(',');
  const studentStruct = studentIds.reduce((acc, stud) => {
    const mapping = studentmapping[students[stud]] || defaultMapping;
    const attribs = groupingKeys.reduce(
      (subacc, grp, i) => ({ ...subacc, [grp]: mapping[i] }),
      {}
    );
    return { ...acc, [stud]: attribs };
  }, {});

  const result = focusRole(studentStruct);
  groupingKeys.forEach(x => {
    if (result[x] === undefined) {
      result[x] = {};
    }
  });
  return result;
};

export default (operator: socialOperatorRunnerT);
