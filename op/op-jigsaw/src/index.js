// @flow

import { shuffle } from 'lodash';
import type { ObjectT, SocialStructureT } from 'frog-utils';

export const meta = {
  name: 'Jigsaw',
  type: 'social'
};

export const config = {
  title: 'Configuration for Jigsaw',
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

export const operator = (configData: Object, object: ObjectT) => {
  const { globalStructure, socialStructures } = object;

  const socStruc: SocialStructureT = {};

  const roles = configData.roles.split(',');
  const groupSize = roles.length;

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

  return {
    product: [],
    socialStructure: socStruc
  };
};

export default {
  id: 'op-jigsaw',
  operator,
  config,
  meta
};
