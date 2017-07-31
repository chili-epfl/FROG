// @flow

import { shuffle } from 'lodash';
import { focusRole, type socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Jigsaw',
  type: 'social',
  shortDesc: 'Assign students to groups and roles',
  description:
    'Given a list of roles, students are assigned to groups and roles, where each role only appears once in each group.'
};

const config = {
  type: 'object',
  properties: {
    roles: {
      type: 'string',
      title: 'Comma-separated list of roles'
    },
    mix: {
      type: 'boolean',
      title: 'Mix previous groups?'
    }
  }
};

const operator = (configData, object) => {
  const { globalStructure, socialStructure } = object;

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

export default ({
  id: 'op-jigsaw',
  meta,
  config,
  operator,
  outputDefinition: ['group', 'role']
}: socialOperatorT);
