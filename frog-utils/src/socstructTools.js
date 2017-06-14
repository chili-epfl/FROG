// @flow
import { isNil, forIn, get, setWith } from 'lodash';
import type { socialStructureT, studentStructureT } from './types';

// the opposite of focusRole
// translates from {group: {'1': ['stian']}, role: {'chief': ['stian', 'ola', 'jens'], carpenter: ['anna']}}
// to: {anna: { role: 'carpenter' }, jens: { role: 'chief' }, ola: { role: 'chief' }, stian: { group: '1', role: 'chief' }}
export const focusStudent = (
  structure: socialStructureT
): studentStructureT => {
  const newStruct = {};
  forIn(structure, (attrPairs, grouping) => {
    forIn(attrPairs, (k, v) => {
      k.forEach(
        student =>
          (newStruct[student] = { ...newStruct[student], [grouping]: v })
      );
    });
  });
  return newStruct;
};

const addArrayPath = (x, y, z) => {
  if (get(x, y)) {
    setWith(x, y, [...get(x, y), z], Object);
  } else {
    setWith(x, y, [z], Object);
  }
};

// the opposite of focusStudent
// translates from {anna: { role: 'carpenter' }, jens: { role: 'chief' }, ola: { role: 'chief' }, stian: { group: '1', role: 'chief' }}
// to: {group: {'1': ['stian']}, role: {'chief': ['stian', 'ola', 'jens'], carpenter: ['anna']}}
export const focusRole = (structure: studentStructureT): socialStructureT => {
  const newStruct = {};
  forIn(structure, (attrPairs, student) => {
    forIn(attrPairs, (k, v) => {
      addArrayPath(newStruct, [v, k], student);
    });
  });
  return newStruct;
};
