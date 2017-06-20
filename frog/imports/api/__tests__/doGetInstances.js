// @flow

import {
  type ObjectT,
  type activityDataT,
  type socialStructureT,
  extractUnit
} from 'frog-utils';
import doGetInstances from '../doGetInstances';

const students = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const act = { groupingKey: 'all', plane: 1 };

const createObj = (a: activityDataT, b: socialStructureT = {}): ObjectT => ({
  socialStructure: b,
  activityData: a,
  globalStructure: { studentIds: students }
});

const dataAll = {
  structure: 'all',
  payload: { all: { data: { text: 'This is a message to everyone' } } }
};

const objAll = createObj(dataAll);

test('Get individual instances', () => {
  expect(doGetInstances(act, objAll)).toEqual([
    ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'individual'
  ]);
});

const socStruct: socialStructureT = {
  role: { a: ['1', '2'], b: ['3', '4'], c: ['5', '6'], d: ['7', '8'] },
  group: { chief: ['1', '2', '3', '4', '5'], fireman: ['6', '7', '8', '9'] }
};

const objp2 = createObj(dataAll, socStruct);
test('P2 instances', () => {
  expect(doGetInstances({ plane: 2, groupingKey: 'group' }, objp2)).toEqual([
    ['chief', 'fireman'],
    { groupingKey: 'group' }
  ]);
});

test('P1 instances with social structure', () => {
  expect(doGetInstances({ plane: 1, groupingKey: 'group' }, objp2)).toEqual([
    ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'individual'
  ]);
});

test('P3 jnstances with social structure', () => {
  expect(doGetInstances({ plane: 3, groupingKey: 'group' }, objp2)).toEqual([
    ['all'],
    'all'
  ]);
});

test('Units for object all', () => {
  expect(extractUnit(dataAll, 'all', 'all')).toEqual({
    data: { text: 'This is a message to everyone' }
  });
});

test('Units for object all', () => {
  expect(extractUnit(dataAll, 'individual', 'dd')).toEqual({
    data: { text: 'This is a message to everyone' }
  });
});

const dataInd = {
  structure: 'individual',
  payload: {
    aa: { data: { text: 'This is a message to aa' } },
    bb: { data: { text: 'This is a message to bb' } }
  }
};

const dataRole = {
  structure: { groupingKey: 'group' },
  payload: {
    fireman: { data: { text: 'This is a message to aa' } },
    chief: { data: { text: 'This is a message to bb' } }
  }
};
test('Units for individual', () => {
  expect(extractUnit(dataInd, 'individual', 'aa')).toEqual({
    data: { text: 'This is a message to aa' }
  });
});

test('Individual products to groups', () => {
  expect(() => extractUnit(dataInd, { groupingKey: 'role' }, 'aa')).toThrow();
});

test('Units for groups', () => {
  expect(extractUnit(dataRole, { groupingKey: 'role' }, 'fireman')).toEqual({
    data: { text: 'This is a message to aa' }
  });
});

test('Units for individuals in groups', () => {
  expect(extractUnit(dataRole, 'individual', '1', socStruct)).toEqual({
    data: { text: 'This is a message to bb' }
  });
});

test("Units for individuals in groups, individual doesn't exist", () => {
  expect(() => extractUnit(dataRole, 'individual', '12', socStruct)).toThrow();
});
