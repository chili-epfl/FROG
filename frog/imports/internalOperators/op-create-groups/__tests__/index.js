import lodash from 'lodash';

import operator from '../operatorRunner';

lodash.shuffle = jest.fn(x => [...x].sort());

const obj = { globalStructure: { studentIds: ['1', '2', '3', '4', '5'] } };
const obj4 = { globalStructure: { studentIds: ['1', '2', '3', '4'] } };

test('Create groups minimum', () =>
  expect(operator({ strategy: 'minimum', groupsize: 2 }, obj)).toEqual({
    group: { '1': ['1', '2', '5'], '2': ['3', '4'] }
  }));

test('Create groups minimum, 4', () =>
  expect(operator({ strategy: 'minimum', groupsize: 2 }, obj4)).toEqual({
    group: { '1': ['1', '2'], '2': ['3', '4'] }
  }));

test('Create groups maximum', () =>
  expect(operator({ strategy: 'maximum', groupsize: 2 }, obj)).toEqual({
    group: { '1': ['1', '2'], '2': ['3', '4'], '3': ['5'] }
  }));

test('Create groups individual max', () =>
  expect(operator({ strategy: 'maximum', groupsize: 1 }, obj)).toEqual({
    group: { '1': ['1'], '2': ['2'], '3': ['3'], '4': ['4'], '5': ['5'] }
  }));

const obj2 = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5', '6', '7', '8'] }
};
test('Create groups individual min', () =>
  expect(operator({ strategy: 'minimum', groupsize: 3 }, obj2)).toEqual({
    group: { '1': ['1', '2', '3', '8'], '2': ['4', '5', '6', '7'] }
  }));

test('Create one large group with everyone', () =>
  expect(operator({ strategy: 'minimum', groupsize: 999 }, obj)).toEqual({
    group: { '1': ['1', '2', '3', '4', '5'] }
  }));

test('Create two groups, odd number', () =>
  expect(operator({ groupnumber: true, globalnum: 2 }, obj)).toEqual({
    group: { '1': ['1', '3', '5'], '2': ['2', '4'] }
  }));

test('Create two groups, exact number', () =>
  expect(operator({ groupnumber: true, globalnum: 2 }, obj4)).toEqual({
    group: { '1': ['1', '3'], '2': ['2', '4'] }
  }));

test('Create three groups, very unequal', () =>
  expect(operator({ groupnumber: true, globalnum: 3 }, obj4)).toEqual({
    group: { '1': ['1', '4'], '2': ['2'], '3': ['3'] }
  }));

const obj11 = {
  globalStructure: {
    studentIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
  }
};

test('Works with large numbers, 3', () =>
  expect(operator({ groupnumber: true, globalnum: 3 }, obj11)).toEqual({
    group: {
      '1': ['1', '2', '5', '8'],
      '2': ['10', '3', '6', '9'],
      '3': ['11', '4', '7']
    }
  }));

test('Works with large numbers, 4', () =>
  expect(operator({ groupnumber: true, globalnum: 4 }, obj11)).toEqual({
    group: {
      '1': ['1', '3', '7'],
      '2': ['10', '4', '8'],
      '3': ['11', '5', '9'],
      '4': ['2', '6']
    }
  }));

test('Works with large numbers, 5', () =>
  expect(operator({ groupnumber: true, globalnum: 5 }, obj11)).toEqual({
    group: {
      '1': ['1', '4', '9'],
      '2': ['10', '5'],
      '3': ['11', '6'],
      '4': ['2', '7'],
      '5': ['3', '8']
    }
  }));

test('test empty', () =>
  expect(
    operator(
      { groupsize: 4, strategy: 'minimum' },
      {
        socialStructure: {},
        globalStructure: {
          studentIds: [],
          students: {}
        }
      }
    )
  ).toEqual({ group: {} }));

test('Fixed number of groups and several extraneous students to assign to groups', () =>
  expect(
    operator(
      { groupnumber: true, globalnum: 8, grouping: 'group' },
      {
        _id: 'cjqp26bs7000g01ywt3m8s6n9',
        activityData: {
          structure: 'all',
          payload: { all: { data: null, config: {} } }
        },
        socialStructure: {},
        globalStructure: {
          studentIds: 'QWERTZUIOPASDFGHJKLYXCVBNM123'.split('')
        }
      }
    )
  ).toEqual({
    group: {
      '1': ['1', 'F', 'N', 'V'],
      '2': ['2', 'G', 'O', 'W'],
      '3': ['3', 'H', 'P', 'X'],
      '4': ['A', 'I', 'Q', 'Y'],
      '5': ['B', 'J', 'R', 'Z'],
      '6': ['C', 'K', 'S'],
      '7': ['D', 'L', 'T'],
      '8': ['E', 'M', 'U']
    }
  }));
