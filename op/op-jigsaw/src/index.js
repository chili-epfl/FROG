// @flow
import type { ObjectT, SocialStructureT } from 'frog-utils';

export const meta = {
  name: 'Jigsaw',
  type: 'social'
};

export const config = {
  title: 'Configuration for Jigsaw',
  type: 'object',
  properties: {}
};

const randomChoice = array => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

export const operator = (configData: Object, object: ObjectT) => {
  const { globalStructure } = object;

  const socStruc: SocialStructureT = {};
  globalStructure.studentIds.forEach(studentId => {
    socStruc[studentId] = {
      role: randomChoice(['French', 'English', 'German']),
      group: randomChoice(['A', 'B'])
    };
  });
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
