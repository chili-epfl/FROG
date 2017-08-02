// @flow

import traceSocial from '../traceSocial';

const activities = [{ _id: 'a1' }];
const connections = [{ _id: 'c1', target: { id: 'a1' }, source: { id: 'o1' } }];
const operators = [{ _id: 'o1', type: 'social', operatorType: 'op-jigsaw' }];
test('simple case', () => {
  expect(traceSocial(activities, operators, connections)).toEqual({
    a1: ['group', 'role']
  });
});

const connections2 = [
  { _id: 'c1', target: { id: 'a1' }, source: { id: 'o2' } }
];
const operators2 = [
  {
    _id: 'o2',
    type: 'social',
    operatorType: 'op-create-groups',
    data: { grouping: 'profession' }
  }
];

test('simple case using function', () => {
  expect(traceSocial(activities, operators2, connections2)).toEqual({
    a1: ['profession']
  });
});

const activities3 = [{ _id: 'a1' }, { _id: 'a2' }, { _id: 'a3' }];
const operators3 = [...operators, ...operators2];
const connections3 = [
  { _id: 'c1', target: { id: 'a1' }, source: { id: 'o1' } },
  { _id: 'c2', target: { id: 'a1' }, source: { id: 'o2' } },
  { _id: 'c3', target: { id: 'a2' }, source: { id: 'o2' } }
];
test('one case using both, and one neither', () => {
  expect(traceSocial(activities3, operators3, connections3)).toEqual({
    a1: ['group', 'role', 'profession'],
    a2: ['profession']
  });
});
