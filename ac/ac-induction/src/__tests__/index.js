// @flow

import {
  arrayEquals,
  arrayIncludes,
  arrayDifference,
  arrayIntersection,
  arrayMinus,
  stringToArray
} from '../ArrayFun';

import {
  containsNotRespected,
  containsContradictory,
  containsOneSuffisantSet,
  containsNoUnnecessary
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
  expect(containsNotRespected(arr1, arr2).result).toBeTruthy();
});

test('test 14 bis: contains one not respected', () => {
  expect(
    arrayEquals(containsNotRespected(arr1, arr2).properties, [3])
  ).toBeTruthy();
});

test("test 15: doesn't contain not respected", () => {
  expect(containsNotRespected(arr2, arr1).result).toBeFalsy();
});

test("test 15 bis: doesn't contain not respected", () => {
  expect(containsNotRespected(arr2, arr1).properties.length).toEqual(0);
});

test('test 16: contains contradictories', () => {
  expect(containsContradictory(arr1, arr2).result).toBeTruthy();
});

test('test 16 bis: contains contradictories', () => {
  expect(
    arrayEquals(containsContradictory(arr1, arr2).properties, [1, 2])
  ).toBeTruthy();
});

test("test 17: doesn't contains contradictories", () => {
  expect(containsContradictory(arr1, arr5).result).toBeFalsy();
});

test("test 17 bis: doesn't contains contradictories", () => {
  expect(containsContradictory(arr1, arr5).properties.length).toEqual(0);
});

test('test 18: contains one suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr3).result).toBeTruthy();
});

test('test 18 bis: contains one suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr3).properties.length).toEqual(0);
});

test('test 19: contains two suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr4).result).toBeTruthy();
});

test('test 19 bis: contains two suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr4).properties.length).toEqual(0);
});

test('test 20: contains no suffisant on bad suffisants data', () => {
  expect(containsOneSuffisantSet(arr1, arr5).result).toBeFalsy();
});

test('test 21: contains no suffisant', () => {
  expect(containsOneSuffisantSet(arr1, arr6).result).toBeFalsy();
});

test('test 21 bis: contains no suffisant', () => {
  expect(
    arrayEquals(containsOneSuffisantSet(arr1, arr6).properties, arr1)
  ).toBeTruthy();
});

test('test 22: contains one suffisant (not same order)', () => {
  expect(containsOneSuffisantSet(arr1, arr7).result).toBeTruthy();
});

test('test 23: contains no unnecessary', () => {
  expect(containsNoUnnecessary(arr1, arr2, arr3).result).toBeTruthy();
});

test('test 23 bis: contains no unnecessary', () => {
  expect(containsNoUnnecessary(arr1, arr2, arr3).properties.length).toEqual(0);
});

test('test 24: contains unnecessaries', () => {
  expect(containsNoUnnecessary(arr1, arr2, arr7).result).toBeFalsy();
});

test('test 24 bis: contains unnecessaries', () => {
  expect(
    arrayEquals(containsNoUnnecessary(arr1, arr2, arr7).properties, [2])
  ).toBeTruthy();
});

test('test 25: contains no unnecessaries empty', () => {
  expect(containsNoUnnecessary([], arr5, arr4).result).toBeTruthy();
});

test('test 26: arrayMinus arrays', () => {
  expect(arrayMinus(arr1, arr2Bis)).toEqual([3]);
});

test('test 27: arrayMinus self', () => {
  expect(arrayMinus(arr7, arr7).length).toEqual(0);
});

test('test 28: arrayMinus arrays of arrays', () => {
  expect(arrayEquals(arrayMinus(arr4, arr3Bis), [[3, 2]])).toBeTruthy();
});
