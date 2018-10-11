// @flow
import { shuffle } from 'lodash';
import { focusRole, type socialOperatorRunnerT } from 'frog-utils';

const operator = (configData, object) => {
  const { globalStructure, socialStructure } = object;

  if (globalStructure.studentIds.length === 0) {
    return { group: {}, role: {} };
  }
  const roles = configData.roles.split(',').map(x => x.trim());
  const groupSize = roles.length;
  const socStruc = {};
  if (configData.mix) {
    const prevStruc = socialStructure;
    const roleCounts = roles.reduce((acc, role) => ({ ...acc, [role]: 0 }), {});
    shuffle(globalStructure.studentIds).forEach(studentId => {
      const prevRole = prevStruc[studentId].role;
      socStruc[studentId] = {
        role: prevRole,
        group: roleCounts[prevRole]
      };
      roleCounts[prevRole] += 1;
    });
  } else {
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
