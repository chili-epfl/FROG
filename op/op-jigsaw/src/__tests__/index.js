import lodash from 'lodash';

import operator from '../operatorRunner';

const object = {
  globalStructure: { studentIds: [1, 2, 3, 4, 5] },
  socialStructure: {}
};

const expectedOutput = {
  group: { '0': ['1', '2'], '1': ['3', '4'], '2': ['5'] },
  role: { baker: ['2', '4'], chef: ['1', '3', '5'] }
};

const configData = { roles: 'chef, baker' };

lodash.shuffle = jest.fn(x => x.sort());

test('Works', () => {
  expect(operator(configData, object)).toEqual(expectedOutput);
});

test('test empty', () =>
  expect(
    operator(configData, {
      socialStructure: {},
      globalStructure: {
        studentIds: [],
        students: {}
      }
    })
  ).toEqual({ group: {}, role: {} }));

test('test almost empty', () =>
  expect(
    operator(configData, {
      socialStructure: {},
      globalStructure: {
        studentIds: ['a'],
        students: {}
      }
    })
  ).toEqual({ group: { '0': ['a'] }, role: { chef: ['a'] } }));
