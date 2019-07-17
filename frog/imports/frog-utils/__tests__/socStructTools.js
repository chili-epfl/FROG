// @flow

import type { socialStructureT, studentStructureT } from '../types';
import {
  focusStudent,
  focusRole,
  mergeSocialStructures,
  addArrayPath,
  getAttributeKeys,
  getAttributeValues
} from '../socstructTools';

const exampleRole: socialStructureT = {
  group: { '1': ['stian'] },
  role: { chief: ['stian', 'jens', 'ola'], carpenter: ['anna'] }
};

const exampleStudent: studentStructureT = {
  stian: { group: '1', role: 'chief' },
  jens: { role: 'chief' },
  ola: { role: 'chief' },
  anna: { role: 'carpenter' }
};

test('Comment is correct', () => {
  expect(focusStudent(exampleRole)).toEqual(exampleStudent);
  expect(focusRole(exampleStudent)).toEqual(exampleRole);
});

test('Functions are inverse of each other, exampleRole', () => {
  expect(focusRole(focusStudent(exampleRole))).toEqual(exampleRole);
});

test('Functions are inverse of each other, exampleStudent', () => {
  expect(focusStudent(focusRole(exampleStudent))).toEqual(exampleStudent);
});

test('Ridiculous nesting', () => {
  expect(
    focusStudent(focusRole(focusStudent(focusRole(focusStudent(exampleRole)))))
  ).toEqual(exampleStudent);
});

// ----------------------------------------
const functionalAddArrayPath = (x, y, z) => {
  addArrayPath(x, y, z);
  return x;
};

test('Add array path', () => {
  expect(functionalAddArrayPath({}, 'x', 'y')).toEqual({ x: ['y'] });
  expect(functionalAddArrayPath({ a: [1], b: [2] }, 'c', 1)).toEqual({
    a: [1],
    b: [2],
    c: [1]
  });
  expect(functionalAddArrayPath({ a: [1], b: [2] }, 'c', 1)).toEqual({
    a: [1],
    b: [2],
    c: [1]
  });
  expect(functionalAddArrayPath({ a: [1], b: [2] }, 'a', 2)).toEqual({
    a: [1, 2],
    b: [2]
  });
  expect(functionalAddArrayPath({}, ['a', 'b'], 2)).toEqual({
    a: { b: [2] }
  });
});

// ----------------------------------------

const socStruct1: socialStructureT = {
  role: { chef: ['aa', 'bb'], waiter: ['dd', 'ee'] }
};
const socStruct2: socialStructureT = {
  group: { '1': ['aa', 'cc'], '2': ['dd', 'ff'] }
};

const desiredSoc: socialStructureT = {
  role: { chef: ['aa', 'bb'], waiter: ['dd', 'ee'] },
  group: { '1': ['aa', 'cc'], '2': ['dd', 'ff'] }
};

test('Merge two social structures', () =>
  expect(mergeSocialStructures([socStruct1, socStruct2])).toEqual(desiredSoc));

test('Merging two structures with overlapping keys gives error', () =>
  expect(() => mergeSocialStructures([socStruct1, socStruct1])).toThrow());

// ----------------------------------------

test('Get socialStructure attributeKeys', () =>
  expect(getAttributeKeys(socStruct1)).toEqual(['role']));

test('Get socialStructure attributeValues', () =>
  expect(getAttributeValues(socStruct1, 'role')).toEqual(['chef', 'waiter']));
