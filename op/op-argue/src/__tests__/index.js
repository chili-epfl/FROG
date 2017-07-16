// @flow

import lodash from 'lodash';

import pkg, { flatten, dist, computeDist } from '../index';

const operator = pkg.operator;

lodash.shuffle = jest.fn(x => [...x].sort());

const data1 = {
  quizz1: ['A', 'B', 'C'],
  quizz2: {
    q1: '2',
    alpha: { a: 'A', b: 'B' }
  }
};

const data2 = {
  quizz1: ['A', 'B'],
  quizz2: {
    q1: '3',
    alpha: { a: 'C', b: 'B' }
  }
};

const data3 = {
  quizz1: ['A', 'B', 'C'],
  quizz2: {
    q1: '2',
    alpha: { a: 'A', b: 'D' }
  }
};

const data4 = {
  quizz1: ['C', 'E'],
  quizz2: { q1: '8' }
};

const data5 = {
  quizz1: ['C', 'E'],
  quizz2: { q1: '8' }
};

const data6 = {
  quizz1: ['B', 'B'],
  quizz2: { q1: '1' }
};

const obj1 = {
  socialStructure: {},
  globalStructure: {
    studentIds: ['1', '2', '3', '4']
  },
  activityData: {
    structure: 'individual',
    payload: {
      '1': { data: data1, config: {} },
      '2': { data: data2, config: {} },
      '3': { data: data3, config: {} },
      '4': { data: data4, config: {} }
    }
  }
};

const obj2 = {
  socialStructure: {},
  globalStructure: {
    studentIds: ['1', '2', '3', '4', '5']
  },
  activityData: {
    structure: 'individual',
    payload: {
      '1': { data: data1, config: {} },
      '2': { data: data2, config: {} },
      '3': { data: data3, config: {} },
      '4': { data: data4, config: {} },
      '5': { data: data5, config: {} }
    }
  }
};

const obj3 = {
  socialStructure: {},
  globalStructure: {
    studentIds: ['1', '2', '3', '4', '5', '6']
  },
  activityData: {
    structure: 'individual',
    payload: {
      '1': { data: data1, config: {} },
      '2': { data: data2, config: {} },
      '3': { data: data3, config: {} },
      '4': { data: data4, config: {} },
      '5': { data: data5, config: {} },
      '6': { data: data6, config: {} }
    }
  }
};

const expected1 = {
  group: { '1': ['1', '4'], '2': ['2', '3'] }
};

const expected2 = {
  group: { '1': ['1', '4'], '2': ['2', '3', '5'] }
};

const expected3 = {
  group: { '1': ['1', '5'], '2': ['2', '3'], '3': ['4', '6'] }
};

test('Flatten works', () =>
  expect(flatten(data1)).toEqual({
    'quizz1.0': 'A',
    'quizz1.1': 'B',
    'quizz1.2': 'C',
    'quizz2.q1': '2',
    'quizz2.alpha.a': 'A',
    'quizz2.alpha.b': 'B'
  }));

test('Dist works with empty objects', () =>
  expect(dist({}, {}).size).toEqual(0));

test('Dist works with identical objects', () =>
  expect(dist(flatten(data1), flatten(data1)).size).toEqual(0));

test('Dist does not count missing keys as different answers', () =>
  expect(dist(flatten(data1), flatten(data2)).size).toEqual(2));

test('ComputeDist works', () =>
  expect(computeDist([data1, data2, data3].map(flatten))).toEqual([
    [0, 2, 1],
    [2, 0, 3],
    [1, 3, 0]
  ]));

test('ComputeDist works', () =>
  expect(
    computeDist([data1, data2, data3, data4, data5, data6].map(flatten))
  ).toEqual([
    [0, 2, 1, 3, 3, 2],
    [2, 0, 3, 3, 3, 2],
    [1, 3, 0, 3, 3, 2],
    [3, 3, 3, 0, 0, 3],
    [3, 3, 3, 0, 0, 3],
    [2, 2, 2, 3, 3, 0]
  ]));

test('Operator throws if incoming data is not individual', () =>
  expect(() =>
    operator(
      {},
      {
        socialStructure: {},
        globalStructure: { studentIds: [] },
        activityData: { structure: 'all', payload: {} }
      }
    )
  ).toThrow());

test('Operator works with 0 students', () =>
  expect(
    operator(
      {},
      {
        socialStructure: {},
        globalStructure: { studentIds: [] },
        activityData: { structure: 'individual', payload: {} }
      }
    )
  ).toEqual({ group: {} }));

test('Operator works with 1 student', () =>
  expect(
    operator(
      {},
      {
        socialStructure: {},
        globalStructure: { studentIds: ['Louis'] },
        activityData: {
          structure: 'individual',
          payload: { Louis: { data: {}, config: {} } }
        }
      }
    )
  ).toEqual({ group: { '1': ['Louis'] } }));

test('Operator works with 4 students', () =>
  expect(operator({}, obj1)).toEqual(expected1));

test('Operator works with 5 students', () =>
  expect(operator({}, obj2)).toEqual(expected2));

test('Operator works with 6 students', () =>
  expect(operator({}, obj3)).toEqual(expected3));
