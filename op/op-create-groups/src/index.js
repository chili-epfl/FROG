// @flow

import { shuffle } from 'lodash';
import type { ObjectT, SocialStructureT } from 'frog-utils';
import { focusRole } from 'frog-utils';

export const meta = {
  name: 'Create groups',
  type: 'social'
};

export const config = {
  type: 'object',
  properties: {
    roles: {
      type: 'number',
      title: 'Desired group size'
    },
    strategy: {
      type: 'string',
      title:
        'Group formation strategy, optimize for at least this number of students in each group (minimum) or no more than this number of students per group (maximum)?',
      enum: ['minimum', 'maximum']
    }
  }
};

export const operator = (configData, object) => {
  const { globalStructure, socialStructure } = object;

  const roles = configData.roles.split(',').map(x => x.trim());
  const groupSize = roles.length;
  const socStruc = {};
  if (configData.mix) {
    const prevStruc = socialStructures[0];
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

export default {
  id: 'op-create-groups',
  operator,
  config,
  meta
};
