import lodash from 'lodash';

import pkg from '../index';

const operator = pkg.operator;

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

test('Create groups individual', () =>
  expect(operator({ strategy: 'maximum', groupsize: 1 }, obj)).toEqual({
    group: { '1': ['1'], '2': ['2'], '3': ['3'], '4': ['4'], '5': ['5'] }
  }));

const obj2 = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5', '6', '7', '8'] }
};
test('Create groups individual', () =>
  expect(operator({ strategy: 'minimum', groupsize: 3 }, obj2)).toEqual({
    group: { '1': ['1', '2', '3', '8'], '2': ['4', '5', '6', '7'] }
  }));

test('Create one large group with everyone', () =>
  expect(operator({ strategy: 'minimum', groupsize: 999 }, obj)).toEqual({
    group: { '1': ['1', '2', '3', '4', '5'] }
  }));

test('Create two groups, odd number', () =>
  expect(operator({ groupnumber: true, globalnum: 2 }, obj)).toEqual({
    group: { '1': ['3', '4', '5'], '2': ['1', '2'] }
  }));

test('Create two groups, exact number', () =>
  expect(operator({ groupnumber: true, globalnum: 2 }, obj4)).toEqual({
    group: { '1': ['3', '4'], '2': ['1', '2'] }
  }));

test('Create three groups, very unequal', () =>
  expect(operator({ groupnumber: true, globalnum: 3 }, obj4)).toEqual({
    group: { '1': ['4'], '2': ['3'], '3': ['1', '2'] }
  }));

const obj11 = {
  globalStructure: {
    studentIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
  }
};

test('Works with large numbers, 3', () =>
  expect(operator({ groupnumber: true, globalnum: 3 }, obj11)).toEqual({
    group: {
      '1': ['6', '7', '8', '9'],
      '2': ['2', '3', '4', '5'],
      '3': ['1', '10', '11']
    }
  }));

test('Works with large numbers, 4', () =>
  expect(operator({ groupnumber: true, globalnum: 4 }, obj11)).toEqual({
    group: {
      '1': ['7', '8', '9'],
      '2': ['4', '5', '6'],
      '3': ['11', '2', '3'],
      '4': ['1', '10']
    }
  }));

test('Works with large numbers, 5', () =>
  expect(operator({ groupnumber: true, globalnum: 5 }, obj11)).toEqual({
    group: {
      '1': ['8', '9'],
      '2': ['6', '7'],
      '3': ['4', '5'],
      '4': ['2', '3'],
      '5': ['1', '10', '11']
    }
  }));
