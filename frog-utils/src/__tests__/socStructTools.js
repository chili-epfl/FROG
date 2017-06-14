// @flow
import { test, expect } from 'jest';

import type { socialStructureT, studentStructureT } from '../types';
import { focusStudent, focusRole } from '../socstructTools';

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
