// @flow
import { shuffle } from 'lodash';
import {
  focusRole,
  focusStudent,
  getRotateable,
  type socialOperatorRunnerT
} from 'frog-utils';

const operator = (configData, object) => {
  const { globalStructure, socialStructure } = object;

  if (globalStructure.studentIds.length === 0) {
    return { group: {}, role: {} };
  }

  let socStruc = {};
  if (configData.mix) {
    // group: { '0': ['1', '2'], '1': ['3', '4'], '2': ['5'] },
    // role: { baker: ['2', '4'], chef: ['1', '3', '5'] }
    const roles = Object.keys(socialStructure.role);
    const newRoles = getRotateable(roles, 1);
    const students = focusStudent(socialStructure);
    Object.keys(students).forEach(id => {
      if (students[id]?.role) {
        students[id].role = newRoles[roles.indexOf(students[id].role)];
      }
    });
    socStruc = students;
  } else {
    const roles = configData.roles.split(',').map(x => x.trim());
    const groupSize = roles.length;
    shuffle(globalStructure.studentIds).forEach((studentId, index) => {
      socStruc[studentId] = {
        role: roles[index % groupSize],
        group: Math.floor(index / groupSize).toString()
      };
    });
  }
  return focusRole(socStruc);
};

export default (operator: socialOperatorRunnerT);
