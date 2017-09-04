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
  },
  quizz3: 'D'
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
  quizz2: { q1: '8' },
  quizz3: 'A'
};

const data5 = {
  quizz1: ['C', 'E'],
  quizz2: { q1: '8' }
};

const data6 = {
  quizz1: ['B', 'B'],
  quizz2: { q1: '1' }
};

const d1 = {
  q1: 'A',
  q2: 'A'
};

const d2 = {
  q1: 'B',
  q2: 'B'
};

const d3 = {
  q1: 'A',
  q2: 'B'
};

const d4 = {
  q1: 'B',
  q2: 'A'
};

const wrap = items => {
  const studentIds = items.map((_, i) => '' + (i + 1));
  const payload = items.reduce(
    (acc, data, i) =>
      Object.assign(acc, { ['' + (i + 1)]: { data, config: {} } }),
    {}
  );
  return {
    socialStructure: {},
    globalStructure: { studentIds, students: {} },
    activityData: { structure: 'individual', payload }
  };
};

const multiplyData = (d, x) => {
  const res = [];
  for (let i = 0; i < d.length; i += 1) {
    for (let j = 0; j < x; j += 1) {
      res.push(d[i]);
    }
  }
  return res;
};

const geneData = n => {
  const data = [];
  const rdm65 = () => Math.round(Math.random() * 5) + 65;
  for (let i = 0; i < n; i += 1) {
    const tmp = {
      q1: String.fromCharCode(rdm65()),
      q2: String.fromCharCode(rdm65()),
      q3: String.fromCharCode(rdm65()),
      q4: String.fromCharCode(rdm65()),
      q5: String.fromCharCode(rdm65())
    };
    data.push(tmp);
  }
  return data;
};

const obj1 = wrap([data1, data2, data3, data4]);
const obj2 = wrap([data1, data2, data3, data4, data5]);
const obj3 = wrap([data1, data2, data3, data4, data5, data6]);
const obj4 = wrap(multiplyData([d1, d3, d4, d2], 25));
const obj5 = wrap(geneData(500));

const expected1 = {
  group: { '1': ['1', '4'], '2': ['2', '3'] }
};

const expected2 = {
  group: { '1': ['1', '4'], '2': ['2', '3', '5'] }
};

const expected3 = {
  group: { '1': ['1', '4'], '2': ['2', '3'], '3': ['5', '6'] }
};

const expectedMult = res => {
  const l = Object.keys(res.group).length;
  let success = true;
  for (let i = 0; i < l; i += 1) {
    const elem = res.group[(i + 1).toString()];
    switch (true) {
      case Number(elem[0]) > 0 * l / 2 && Number(elem[0]) < 1 * l / 2 + 1:
        success =
          success &&
          Number(elem[1]) > 3 * l / 2 &&
          Number(elem[1]) < 4 * l / 2 + 1;
        break;
      case Number(elem[0]) > 1 * l / 2 && Number(elem[0]) < 2 * l / 2 + 1:
        success =
          success &&
          Number(elem[1]) > 2 * l / 2 &&
          Number(elem[1]) < 3 * l / 2 + 1;
        break;
      default:
    }
  }
  return success;
};

const computeSpeed = (op, conf, obj) => {
  const t0 = new Date().getTime();
  op(conf, obj);
  const t1 = new Date().getTime();
  return (t1 - t0) / 1000.0;
};

test('Flatten works', () =>
  expect(flatten(data1)).toEqual({
    'quizz1.0': 'A',
    'quizz1.1': 'B',
    'quizz1.2': 'C',
    'quizz2.q1': '2',
    'quizz2.alpha.a': 'A',
    'quizz2.alpha.b': 'B',
    quizz3: 'D'
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
    [0, 2, 1, 4, 3, 2],
    [2, 0, 3, 3, 3, 2],
    [1, 3, 0, 3, 3, 2],
    [4, 3, 3, 0, 0, 3],
    [3, 3, 3, 0, 0, 3],
    [2, 2, 2, 3, 3, 0]
  ]));

test('Operator throws if incoming data is not individual', () =>
  expect(() =>
    operator(
      {},
      {
        socialStructure: {},
        globalStructure: { studentIds: [], students: {} },
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
        globalStructure: { studentIds: [], students: {} },
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
        globalStructure: { studentIds: ['Louis'], students: {} },
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

test('4 students types, 5 of each', () =>
  expect(expectedMult(operator({}, obj4))).toBeTruthy());

test('fully random data for 1000', () =>
  expect(computeSpeed(operator, {}, obj5)).toBeLessThan(60));
