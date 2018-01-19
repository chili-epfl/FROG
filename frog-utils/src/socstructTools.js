// @flow
import { forIn, get, setWith } from 'lodash';
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

// add an item to an array at x.y, initializing array if it does not already exist
// y can be a nested path expressed as an array
// for example, if x = {}, addArrayPath(x, ['a', 'b'], 1), then x = {a: {b: [1] } }
export const addArrayPath = (x: Object, y: string | string[], z: any) => {
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

// merges social structures, assumes no top level keys (groupings) overlap
export const mergeSocialStructures = (
  structures: socialStructureT[]
): socialStructureT => {
  if (structures.length === 1) {
    return structures[0];
  }
  const keys = structures?.reduce((acc, k) => [...acc, ...Object.keys(k)], []);
  if (new Set(keys).size < keys.length) {
    throw 'Cannot merge two social structures with overlapping attributeKeys';
  }
  return structures.reduce((acc, k) => ({ ...acc, ...k }), {});
};

export const getAttributeKeys = (struct: socialStructureT): string[] =>
  struct ? Object.keys(struct) : [];

export const getAttributeValues = (
  struct: socialStructureT,
  key: string
): string[] => {
  if (struct && struct[key]) {
    return Object.keys(struct[key]);
  } else {
    return [];
  }
};
