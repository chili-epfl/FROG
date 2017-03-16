// @flow

import type { ObjectT, SocialStructureT } from 'frog-utils';

export const meta = {
  name: 'Argue',
  type: 'social'
};

export const config = {
  title: 'Configuration for Argue',
  type: 'object',
  properties: {}
};

export const operator = (configData: Object, object: ObjectT) => {
  const { globalStructure } = object;

  const socStruc: SocialStructureT = {};

  globalStructure.studentIds.forEach((studentId, index) => {
    socStruc[studentId] = {
      group: Math.floor(index / 2).toString()
    };
  });

  return {
    product: [],
    socialStructure: socStruc
  };
};

export default {
  id: 'op-argue',
  operator,
  config,
  meta
};
