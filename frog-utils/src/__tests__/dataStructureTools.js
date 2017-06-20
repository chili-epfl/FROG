// @flow

import { extractUnit, getMergedExtractedUnit } from '../dataStructureTools';

const dataEmpty = {
  structure: 'all',
  payload: { all: {} }
};

const dataAll = {
  structure: 'all',
  payload: { all: { data: { text: 'data' }, config: { text: 'config' } } }
};

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

const socStruct = {
  role: { a: ['1', '2'], b: ['3', '4'], c: ['5', '6'], d: ['7', '8'] },
  group: { chief: ['1', '2', '3', '4', '5'], fireman: ['6', '7', '8', '9'] }
};

const configData = { title: 'hello world', text: 'this is text' };

test('Works on empty data', () => {
  expect(extractUnit(dataEmpty, 'all', 'all')).toEqual({});
});

test('Units for object all', () => {
  expect(extractUnit(dataAll, 'all', 'all')).toEqual({
    data: { text: 'data' },
    config: { text: 'config' }
  });
});

test('Units for object all', () => {
  expect(extractUnit(dataAll, 'individual', 'aa')).toEqual({
    data: { text: 'data' },
    config: { text: 'config' }
  });
});

test('Units for individual', () => {
  expect(extractUnit(dataInd, 'individual', 'bb')).toEqual({
    data: { text: 'This is a message to bb' }
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

test('Empty data with configData', () => {
  expect(getMergedExtractedUnit(configData, dataEmpty, 'all', 'all')).toEqual({
    data: undefined,
    config: { title: 'hello world', text: 'this is text' }
  });
});

test('Object All and configData and overwrite', () => {
  expect(getMergedExtractedUnit(configData, dataAll, 'all', 'all')).toEqual({
    data: { text: 'data' },
    config: { text: 'config', title: 'hello world' }
  });
});

test('Units for groups with configData', () => {
  expect(
    getMergedExtractedUnit(
      configData,
      dataRole,
      { groupingKey: 'role' },
      'fireman'
    )
  ).toEqual({
    data: { text: 'This is a message to aa' },
    config: { title: 'hello world', text: 'this is text' }
  });
});
