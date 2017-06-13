import { focusStudent, focusRole } from '../socstructTools';

const exampleRole = {
  group: { '1': ['stian'] },
  role: { chief: ['stian', 'jens', 'ola'], carpenter: ['anna'] }
};

const exampleStudent = {
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
