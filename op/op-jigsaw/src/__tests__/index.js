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

const object2 = {
  globalStructure: { studentIds: [1, 2, 3, 4, 5] },
  socialStructure: {
    group: { '0': ['1', '2'], '1': ['3', '4'], '2': ['5'] },
    role: { baker: ['2', '4'], chef: ['1', '3', '5'] }
  }
};

const configData2 = { mix: true };
test.only('test mixing', () =>
  expect(operator(configData2, object2)).toEqual({
    group: { '0': ['1', '2'], '1': ['3', '4'], '2': ['5'] },
    role: { baker: ['1', '3', '5'], chef: ['2', '4'] }
  }));

const object5 = {
  globalStructure: { studentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  socialStructure: {}
};

test('test larger group', () =>
  expect(operator({ roles: 'editor, author, salesman, ceo' }, object5)).toEqual(
    {
      group: {
        '0': ['1', '2', '3', '10'],
        '1': ['4', '5', '6', '7'],
        '2': ['8', '9']
      },
      role: {
        author: ['5', '9', '10'],
        ceo: ['3', '7'],
        editor: ['1', '4', '8'],
        salesman: ['2', '6']
      }
    }
  ));

const object3 = {
  globalStructure: { studentIds: [1, 2, 3, 4, 5] },
  socialStructure: {
    group: {
      '0': ['1', '2', '3', '10'],
      '1': ['4', '5', '6', '7'],
      '2': ['8', '9']
    },
    role: {
      author: ['5', '9', '10'],
      ceo: ['3', '7'],
      editor: ['1', '4', '8'],
      salesman: ['2', '6']
    }
  }
};

test('test mixing larger', () =>
  expect(operator({ mix: true }, object3)).toEqual({
    group: {
      '0': ['1', '2', '3', '10'],
      '1': ['4', '5', '6', '7'],
      '2': ['8', '9']
    },
    role: {
      author: ['2', '6'],
      ceo: ['5', '9', '10'],
      editor: ['3', '7'],
      salesman: ['1', '4', '8']
    }
  }));
