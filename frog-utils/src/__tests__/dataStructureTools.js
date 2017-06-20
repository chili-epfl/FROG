// @flow

import type { socialStructureT, studentStructureT } from '../types';
import { extractUnit } from '../dataStructureTools';

const dataEmpty = {
  structure: 'all',
  payload: { all: {} }
};

test('Works on empty data', () => {
  expect(extractUnit(dataEmpty, 'all', 'all')).toEqual({});
});

const payloadAll = {
  data: { a: 1 },
  config: { b: 1 }
};

const dataAll = {
  structure: 'all',
  payload: { all: payloadAll }
};

test('Units for object all', () => {
  expect(extractUnit(data1, 'all', 'all')).toEqual(payloadAll);
});

test('Units for object all', () => {
  expect(extractUnit(data1, 'individual', 'student123abc')).toEqual(payloadAll);
});

const dataInd = {
  structure: 'individual',
  payload: {
    aa: { data: { text: 'This is a message to aa' } },
    bb: { data: { text: 'This is a message to bb' } }
  }
};

test('Units for individual', () => {
  expect(extractUnit(dataInd, 'individual', 'bb')).toEqual({
    data: { text: 'This is a message to bb' }
  });
});

test('Individual products to groups', () => {
  expect(() => extractUnit(dataInd, { groupingKey: 'role' }, 'aa')).toThrow();
});

const dataRole = {
  structure: { groupingKey: 'group' },
  payload: {
    fireman: { data: { text: 'This is a message to aa' } },
    chief: { data: { text: 'This is a message to bb' } }
  }
};

const socStruct: socialStructureT = {
  role: { a: ['1', '2'], b: ['3', '4'], c: ['5', '6'], d: ['7', '8'] },
  group: { chief: ['1', '2', '3', '4', '5'], fireman: ['6', '7', '8', '9'] }
};

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
