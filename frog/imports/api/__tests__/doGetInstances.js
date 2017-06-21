// @flow

import {
  type ObjectT,
  type activityDataT,
  type socialStructureT
} from 'frog-utils';
import doGetInstances from '../doGetInstances';

const students = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const act = { _id: '', data: {}, groupingKey: 'all', plane: 1 };

const createObj = (a: activityDataT, b: socialStructureT = {}): ObjectT => ({
  socialStructure: b,
  activityData: a,
  globalStructure: { studentIds: students }
});

const dataAll = {
  structure: 'all',
  payload: {
    all: { data: { text: 'This is a message to everyone' }, config: {} }
  }
};

const objAll = createObj(dataAll);

test('Get individual instances', () => {
  expect(doGetInstances(act, objAll)).toEqual({
    groups: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    structure: 'individual'
  });
});

const socStruct: socialStructureT = {
  role: { a: ['1', '2'], b: ['3', '4'], c: ['5', '6'], d: ['7', '8'] },
  group: { chief: ['1', '2', '3', '4', '5'], fireman: ['6', '7', '8', '9'] }
};

const objp2 = createObj(dataAll, socStruct);
test('P2 instances', () => {
  expect(
    doGetInstances({ _id: '', data: {}, plane: 2, groupingKey: 'group' }, objp2)
  ).toEqual({
    groups: ['chief', 'fireman'],
    structure: { groupingKey: 'group' }
  });
});

test('P1 instances with social structure', () => {
  expect(
    doGetInstances({ _id: '', data: {}, plane: 1, groupingKey: 'group' }, objp2)
  ).toEqual({
    groups: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    structure: 'individual'
  });
});

test('P3 jnstances with social structure', () => {
  expect(
    doGetInstances({ _id: '', data: {}, plane: 3, groupingKey: 'group' }, objp2)
  ).toEqual({
    groups: ['all'],
    structure: 'all'
  });
});
