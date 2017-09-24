// @flow
import { type socialOperatorT, focusRole } from 'frog-utils';

const meta = {
  name: 'Assign group by name',
  shortDesc: 'Maps students to groups by name',
  description:
    'Input a list of student names, and group names, and it matches the students to the groups'
};

const config = {
  type: 'object',
  required: ['groupnames', 'defaultgroup', 'studentmapping'],
  properties: {
    groupnames: {
      type: 'string',
      title: 'Group name or names, separated by comma'
    },
    defaultgroup: {
      type: 'string',
      title: 'Default group(s) for students not listed below'
    },
    studentmapping: {
      type: 'string',
      title:
        'On each line student name, comma, group attribute, in the same order as the group names above'
    }
  }
};

const configUI = {
  studentmapping: {
    'ui:widget': 'textarea',
    'ui:emptyValue': '',
    'ui:options': {
      rows: 15
    }
  }
};

const validateConfig = [
  formData => {
    if (!formData.studentmapping || !formData.groupnames) {
      return null;
    }
    const list = formData.studentmapping
      .split('\n')
      .filter(x => x.trim() !== '');
    const n = formData.groupnames.split(',').length;
    const failing = list.find(x => x.split(',').length !== n + 1);
    if (failing) {
      return {
        err: `Line ${failing} does not have right number of attributes`
      };
    }
    const empty = list.find(
      x => x.split(',').findIndex(y => y.trim() === '') !== -1
    );
    if (empty) {
      return {
        err: `Line ${empty} has empty attributes`
      };
    }
  }
];

const operator = (
  configData,
  { globalStructure: { studentIds, students } }
) => {
  const defaultMapping = configData.defaultgroup.split(',').map(f => f.trim());
  const studentmapping = configData.studentmapping
    .split('\n')
    .filter(x => x.trim() !== '')
    .reduce((acc, x) => {
      const f = x.split(',');
      return { ...acc, [f[0]]: f.slice(1).map(x => x.trim()) };
    }, {});
  const groupnames = configData.groupnames.split(',');
  const studentStruct = studentIds.reduce((acc, stud) => {
    const mapping = studentmapping[students[stud]] || defaultMapping;
    const attribs = groupnames.reduce(
      (subacc, grp, i) => ({ ...subacc, [grp]: mapping[i] }),
      {}
    );
    return { ...acc, [stud]: attribs };
  }, {});

  return focusRole(studentStruct);
};

export default ({
  id: 'op-social-name',
  type: 'social',
  operator,
  config,
  configUI,
  validateConfig,
  meta
}: socialOperatorT);
