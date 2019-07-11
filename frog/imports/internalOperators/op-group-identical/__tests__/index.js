// @flow
import type { ObjectT, GlobalStructureT, socialStructureT } from '/imports/frog-utils';

import operator from '../operatorRunner';

const data = {
  structure: 'individual',
  payload: {
    aa: { data: { text: 'This is a message to aa' }, config: {} },
    bb: { data: { text: 'This is a message to aa' }, config: {} },
    cc: { data: { text: 'This is a message to bb' }, config: {} }
  }
};

const object: ObjectT & GlobalStructureT = {
  activityData: data,
  socialStructure: {},
  globalStructure: { studentIds: ['aa', 'bb', 'cc'], students: {} }
};

test('Should work with normal structure', () => {
  expect(operator({}, object)).toEqual(
    ({
      group: {
        '0': ['aa', 'bb'],
        '1': ['cc']
      }
    }: socialStructureT)
  );
});

const objectAll: ObjectT & GlobalStructureT = {
  activityData: {
    structure: 'all',
    payload: { all: { config: {}, data: { string: 'hello' } } }
  },
  socialStructure: {},
  globalStructure: { studentIds: ['aa', 'bb', 'cc'], students: {} }
};

test('Does not work without individual structure', () => {
  expect(() => operator({}, objectAll)).toThrow();
});
