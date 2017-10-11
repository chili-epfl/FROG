// @flow

import {
  arrayEquals,
  arrayIncludes,
  arrayDifference,
  arrayIntersection,
  stringToArray
} from '../ArrayFun';

import {
  containsNotRespected,
  containsContradictory,
  containsOneSuffisantSet
} from '../TestPart/Correction';

const arr1 = [1, 2, 3];
const arr2 = [1, 2];
const arr2Bis = [2, 1];
const arr3 = [[1, 2], [4]];
const arr3Bis = [[4], [2, 1]];
const arr4 = [[2, 3], [1, 2]];
const arr5 = [45, 21, 8];
const arr6 = [[1, 4], [6, 7], [3, 1, 5]];
const arr7 = [[3, 1], [6]];

test('test 1: arrayIncludes true', () => {
  expect(arrayIncludes(arr3, arr2)).toBeTruthy();
});

test('test 2: arrayIncludes false', () => {
  expect(arrayIncludes(arr3, arr1)).toBeFalsy();
});

test('test 3: arrayEquals true', () => {
  expect(arrayEquals(arr1, arr1)).toBeTruthy();
});

test('test 3 bis: arrayEquals true (not same order)', () => {
  expect(arrayEquals(arr2, arr2Bis)).toBeTruthy();
});

test('test 3 ter: arrayEquals true (not same order)', () => {
  expect(arrayEquals(arr3, arr3Bis)).toBeTruthy();
});

test('test 4: arrayEquals false', () => {
  expect(arrayEquals(arr1, arr2)).toBeFalsy();
});

test('test 4 bis: arrayEquals false', () => {
  expect(arrayEquals(arr2, arr1)).toBeFalsy();
});

test('test 5: arrayDifference some', () => {
  expect(arrayDifference(arr1, arr2)).toEqual([3]);
});

test('test 6: arrayDifference none', () => {
  expect(arrayDifference(arr1, arr1)).toEqual([]);
});

test('test 7: arrayIntersection some', () => {
  expect(arrayIntersection(arr1, arr2)).toEqual([1, 2]);
});

test('test 8: arrayIntersection none', () => {
  expect(arrayIntersection(arr1, arr3)).toEqual([]);
});

test('test 9: arrayDifference arrays', () => {
  expect(arrayDifference(arr3, arr4)).toEqual([[4], [2, 3]]);
});

test('test 10: arrayIntersection arrays', () => {
  expect(arrayIntersection(arr3, arr4)).toEqual([[1, 2]]);
});

test('test 11: stringToArray empty', () => {
  expect(stringToArray('')).toEqual([]);
});

test('test 12: stringToArray elements true', () => {
  expect(stringToArray('1,2,3')).toEqual(arr1);
});

test('test 13: stringToArray elements false', () => {
  expect(arrayEquals(stringToArray('3,2'), [3])).toBeFalsy();
});

test('test 14: contains one not respected', () => {
  expect(containsNotRespected(arr1, arr2)).toBeFalsy();
});

test("test 15: doesn't contain not respected", () => {
  expect(containsNotRespected(arr2, arr1)).toBeTruthy();
});

test('test 16: contains contradictories', () => {
  expect(containsContradictory(arr1, arr2)).toBeTruthy();
});

test('test 17: contains contradictories', () => {
  expect(containsContradictory(arr1, arr5)).toBeFalsy();
});

test('test 18: contains one suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr3)).toBeTruthy();
});

test('test 19: contains two suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr4)).toBeTruthy();
});

test('test 18: contains no suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr5)).toBeFalsy();
});

test('test 19: contains no suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr6)).toBeFalsy();
});

test('test 20: contains one suffisant (not same order)', () => {
  expect(containsOneSuffisantSet(arr1, arr7)).toBeTruthy();
});
