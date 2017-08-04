// @flow

import valid from '../validGraphFn';

const getErrs = (a, o, c) => {
  const f = valid(a, o, c);
  return f.errors
    .filter(x => x.type !== 'missingRequiredConfigField')
    .map(x => [x.id, x.type]);
};

const activities = [
  {
    _id: 'a1',
    title: 'noTypeAct',
    startTime: 0,
    length: 5,
    plane: 1,
    activityType: 'ac-brainstorm'
  }
];
const operators = [
  { operatorType: 'op-jigsaw', _id: 'o1', title: '1', type: 'social' },
  { operatorType: 'op-jigsaw', _id: 'o2', title: '2', type: 'social' }
];
const connections = [
  { _id: 'c1', source: { id: 'o1' }, target: { id: 'a1' } },
  { _id: 'c2', source: { id: 'o2' }, target: { id: 'a1' } }
];

test("don't allow overlapping", () => {
  expect(getErrs(activities, operators, connections)).toEqual([
    ['a1', 'overlappingSocialAttributes']
  ]);
});

const actGrouping = [
  {
    groupingKey: 'alfa',
    plane: 2,
    _id: 'a1',
    title: 'noTypeAct',
    startTime: 0,
    length: 5,
    activityType: 'ac-brainstorm'
  }
];
test('make sure grouping key matches with empty - needsSocial', () => {
  expect(getErrs(actGrouping, [], [])).toEqual([
    ['a1', 'needsSocialOp'],
    ['a1', 'groupingKeyNotProvided']
  ]);
});

const op1 = [
  { operatorType: 'op-jigsaw', _id: 'o1', title: '1', type: 'social' }
];
const conn1 = [{ _id: 'c1', source: { id: 'o1' }, target: { id: 'a1' } }];

test('make sure grouping key matches with incoming, fail', () => {
  expect(getErrs(actGrouping, op1, conn1)).toEqual([
    ['a1', 'groupingKeyNotProvided']
  ]);
});

const actGrouping2 = [
  {
    groupingKey: 'group',
    plane: 2,
    _id: 'a1',
    title: 'noTypeAct',
    startTime: 0,
    length: 5,
    activityType: 'ac-brainstorm'
  }
];
test('make sure grouping key matches with incoming, true', () => {
  expect(getErrs(actGrouping2, op1, conn1)).toEqual([]);
});

const datakey = [
  {
    groupingKey: 'group',
    plane: 2,
    _id: 'a1',
    title: 'noTypeAct',
    startTime: 0,
    length: 5,
    activityType: 'ac-brainstorm',
    data: { roles: 'role' }
  }
];
test('make sure config social role matches', () => {
  expect(getErrs(datakey, op1, conn1)).toEqual([]);
});

const datakey1 = [
  {
    groupingKey: 'group',
    plane: 2,
    _id: 'a1',
    title: 'noTypeAct',
    startTime: 0,
    length: 5,
    activityType: 'ac-brainstorm',
    data: { roles: 'group' }
  }
];
test("make sure config and grouping key don't overlap", () => {
  expect(getErrs(datakey1, op1, conn1)).toEqual([
    ['a1', 'groupingKeyInConfig']
  ]);
});

const datakey2 = [
  {
    groupingKey: 'group',
    plane: 2,
    _id: 'a1',
    title: 'noTypeAct',
    startTime: 0,
    length: 5,
    activityType: 'ac-brainstorm',
    data: { roles: 'alfa' }
  }
];
test('make sure grouping key in config exists', () => {
  expect(getErrs(datakey2, op1, conn1)).toEqual([
    ['a1', 'missingSocialAttribute']
  ]);
});

const opcalculated = [
  {
    operatorType: 'op-create-groups',
    data: { grouping: 'peter' },
    _id: 'o1',
    type: 'social'
  }
];

const calculatedAct = [
  {
    groupingKey: 'group',
    plane: 2,
    _id: 'a1',
    title: 'noTypeAct',
    startTime: 0,
    length: 5,
    activityType: 'ac-brainstorm'
  }
];

test('make sure calculated social attribute works, fail', () => {
  expect(getErrs(calculatedAct, opcalculated, conn1)).toEqual([
    ['a1', 'groupingKeyNotProvided']
  ]);
});

const calculatedActWorks = [
  {
    groupingKey: 'peter',
    plane: 2,
    _id: 'a1',
    title: 'noTypeAct',
    startTime: 0,
    length: 5,
    activityType: 'ac-brainstorm'
  }
];
test('make sure calculated social attribute works', () => {
  expect(getErrs(calculatedActWorks, opcalculated, conn1)).toEqual([]);
});

const opsocial = [
  { _id: 'o1', operatorType: 'op-group-identical', data: { old: 'group' } }
];

test('make sure social attributes required by operators is also tested', () => {
  expect(getErrs([], opsocial, [])).toEqual([
    ['o1', 'noOutgoing'],
    ['o1', 'missingSocialAttribute']
  ]);
});

const connop2 = [
  { _id: 'c1', target: { id: 'o1' }, source: { id: 'o2' } },
  { _id: 'c2', target: { id: 'a1' }, source: { id: 'o1' } }
];

const opsocial2 = [
  { _id: 'o1', operatorType: 'op-group-identical', data: { old: 'group' } },
  { _id: 'o2', operatorType: 'op-jigsaw', type: 'social' }
];
test('make sure social attributes required by operators is also tested', () => {
  expect(getErrs([], opsocial2, connop2)).toEqual([]);
});
