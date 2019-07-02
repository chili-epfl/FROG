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
    const rotatingRoles = getRotateable(roles, 0);
    if (socialStructure.group) {
      Object.keys(socialStructure.group).forEach(grp => {
        const students = socialStructure.group[grp];
        students.forEach((student, i) => {
          socStruc[student] = { group: grp, role: rotatingRoles[i] };
        });
      });
    } else {
      const groupSize = roles.length;
      shuffle(globalStructure.studentIds).forEach((studentId, index) => {
        socStruc[studentId] = {
          role: roles[index % groupSize],
          group: Math.floor(index / groupSize).toString()
        };
      });
    }
  }
  return focusRole(socStruc);
};

export default (operator: socialOperatorRunnerT);
