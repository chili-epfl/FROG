// @flow

import { type ActivityPackageT, getRotateable, cloneDeep } from '/imports/frog-utils';
import dashboards from './dashboard.js';

const meta = {
  name: 'Students pick their own groups',
  type: 'react-component',
  shortDesc: 'Manually create groups',
  description:
    'Gives the possibility for students to make their own group if followed by the prox operator',
  category: 'Core tools'
};

const config = {
  type: 'object',
  properties: {
    largeClass: { title: 'Support very large class', type: 'boolean' },
    maxGroups: {
      title: 'Maximum number of groups (empty for unlimited)',
      type: 'number'
    },
    maxStudentsInGroups: {
      title: 'Maximum number of students in each group (empty for unlimited)',
      type: 'number'
    },
    distributeStudents: {
      title:
        'Distribute students who did not participate between all the groups (if not, they are put in a Default group)',
      type: 'boolean'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = { students: {}, groups: {}, studentInfo: {} };

const formatProduct = (cnf, item, _, _1, object) => {
  const students = cloneDeep(item.students);
  const groups = cloneDeep(item.groups);
  const leftoverStudents = object.globalStructure.studentIds.filter(
    x => !item.students[x]
  );
  if (cnf.distributeStudents) {
    const rotateGroups = getRotateable(Object.keys(groups));
    leftoverStudents.forEach((stud, i) => {
      students[stud] = rotateGroups[i];
    });
  } else {
    leftoverStudents.forEach(stud => {
      students[stud] = 'Default';
    });
    groups['Default'] = true;
  }
  return { students, groups };
};

export default ({
  id: 'ac-prox',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboards,
  dataStructure,
  formatProduct
}: ActivityPackageT);
