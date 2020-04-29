// @flow

import {
  type ObjectT,
  type GlobalStructureT,
  values
} from '/imports/frog-utils';

import operator from '../operatorRunner';

const wrap = (instances, distanceMatrix): ObjectT & GlobalStructureT => ({
  activityData: {
    structure: 'all',
    payload: {
      all: {
        data: {
          instances,
          distanceMatrix
        },
        config: {}
      }
    }
  },
  socialStructure: {},
  globalStructure: { studentIds: instances, students: {} }
});

const sortProduct = x => values(x.group).sort((a, b) => (a[0] < b[0] ? -1 : 1));

const test1 = wrap(
  ['s1', 's2', 's3', 's4'],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
);

const test2 = wrap(
  ['s1', 's2', 's3', 's4'],
  [
    [0, 5, 0, 5],
    [5, 0, 5, 8],
    [0, 5, 0, 5],
    [5, 8, 5, 0]
  ]
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
  expect(sortProduct(operator({}, test1))).toEqual([
    ['s1', 's2'],
    ['s3', 's4']
  ]));

test('test 2', () =>
  expect(sortProduct(operator({}, test2))).toEqual([
    ['s1', 's2'],
    ['s3', 's4']
  ]));

test('test 3', () =>
  expect(sortProduct(operator({}, test3))).toEqual([
    ['s1', 's4'],
    ['s2', 's5'],
    ['s3', 's6']
  ]));

test('test 4', () =>
  expect(sortProduct(operator({}, test4))).toEqual([
    ['s1', 's4', 's5'],
    ['s2', 's3']
  ]));

test('test empty', () =>
  expect(
    operator(
      {},
      {
        activityData: {
          structure: 'all',
          payload: {
            all: {
              data: {},
              config: {}
            }
          }
        },
        socialStructure: {},
        globalStructure: {
          studentIds: [],
          students: {}
        }
      }
    )
  ).toEqual({ group: {} }));
