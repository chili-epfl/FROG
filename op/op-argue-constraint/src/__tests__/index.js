// @flow

import { type ObjectT, type GlobalStructureT } from 'frog-utils';

import pkg from '../index';

const operator = pkg.operator;

const wrap = (instances, distanceMatrix, groups): ObjectT & GlobalStructureT => ({
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
    group: groups || { '1': ['s1', 's2', 's3'], '2': ['s4', 's5', 's6'] }
  },
  globalStructure: {
    studentIds: instances,
    students: {}
  }
});

const test1 = wrap(
  ['s1', 's2', 's3', 's4'],
  null
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

const getRandomTest = (length) => {
  const distanceMatrix = Array.from({length}, () => Array.from({ length }, () => 100 * Math.random()))
  const instances = Array.from({length}, (_,i) => 's' + (i+1))
  const groups = instances.reduce(
    (acc, val, idx) => {
      acc['' + ( 1 + (idx % 3) )].push(val)
      return acc
    },
    { '1': [], '2': [], '3': [] }
  )
  return wrap(instances, distanceMatrix, groups)
}

const time = (fn) => {
  const start = new Date().getTime()
  fn()
  const end = new Date().getTime()
  return (end - start) < 2000
}

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

test('test 50', () =>
  expect(
    time(() => operator({ matching: '1,1;2,2' }, getRandomTest(50)))
  ).toEqual(true)
);

test('test 51', () =>
  expect(
    time(() => operator({ matching: '1,1;2,2' }, getRandomTest(51)))
  ).toEqual(true)
);

test('test 99', () =>
  expect(
    time(() => operator({ matching: '1,1;2,2' }, getRandomTest(100)))
  ).toEqual(true)
);

test('test 100', () =>
  expect(
    time(() => operator({ matching: '1,1;2,2' }, getRandomTest(100)))
  ).toEqual(true)
);

test('test 200', () =>
  expect(
    time(() => operator({ matching: '1,1;2,2' }, getRandomTest(200)))
  ).toEqual(true)
);
