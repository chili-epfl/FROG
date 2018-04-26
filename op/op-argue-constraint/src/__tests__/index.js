// @flow

import { type ObjectT, type GlobalStructureT } from 'frog-utils';

import pkg from '../index';

const operator = pkg.operator;

const wrap = (instances, distanceMatrix): ObjectT & GlobalStructureT => ({
  activityData: {
    structure: 'all',
    payload: {
      all: {
        data: { distanceMatrix },
        config: {}
      }
    }
  },
  socialStructure: {
    group: { '1': ['s1', 's2', 's3'], '2': ['s4', 's5', 's6'] }
  },
  globalStructure: {
    studentIds: instances,
    students: {}
  }
});

const test1 = wrap(
  ['s1', 's2', 's3', 's4'],
  [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
);

const test2 = wrap(
  ['s1', 's2', 's3', 's4'],
  [[0, 5, 0, 5], [5, 0, 5, 8], [0, 5, 0, 5], [5, 8, 5, 0]]
);

const test3 = wrap(
  ['s1', 's2', 's3', 's4', 's5', 's6'],
  [
    [0, 0, 0, 5, 3, 3],
    [0, 0, 0, 3, 5, 3],
    [0, 0, 0, 3, 3, 5],
    [5, 3, 3, 0, 0, 0],
    [3, 5, 3, 0, 0, 0],
    [3, 3, 5, 0, 0, 0]
  ]
);

const test4 = wrap(
  ['s1', 's2', 's3', 's4', 's5'],
  [
    [0, 0, 0, 5, 3],
    [0, 0, 0, 3, 5],
    [0, 0, 0, 3, 3],
    [5, 3, 3, 0, 0],
    [3, 5, 3, 0, 0]
  ]
);

test('test 1', () =>
  expect(operator({ matching: '1,1;2,2' }, test1)).toEqual({
    group: { '1': ['s1', 's2'], unmatched1: ['s3', 's4'] }
  }));

test('test 2', () =>
  expect(operator({ matching: '1,1;2,2' }, test2)).toEqual({
    group: { '1': ['s1', 's2'], unmatched1: ['s3', 's4'] }
  }));

test('test 3', () =>
  expect(operator({ matching: '1,1;2,2' }, test3)).toEqual({
    group: { '1': ['s1', 's2'], '2': ['s4', 's5'], unmatched1: ['s3', 's6'] }
  }));

test('test 4', () =>
  expect(operator({ matching: '1,1;2,2' }, test4)).toEqual({
    group: { '1': ['s1', 's2', 's3'], '2': ['s4', 's5'] }
  }));
