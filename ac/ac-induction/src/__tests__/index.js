// @flow

import {
  arrayEquals,
  arrayIncludes,
  arrayDifference,
  arrayIntersection,
  stringToArray
} from '../ArrayFun';

const arr1 = [1, 2, 3];
const arr2 = [1, 2];
const arr3 = [[1, 2], [4]];

test('test 1: arrayIncludes true', () => {
  expect(arrayIncludes(arr3, arr2)).toBeTruthy();
});

test('test 2: arrayIncludes false', () => {
  expect(arrayIncludes(arr3, arr1)).toBeFalsy();
});

test('test 3: arrayEquals true', () => {
  expect(arrayEquals(arr1, arr1)).toBeTruthy();
});

test('test 4: arrayEquals false', () => {
  expect(arrayEquals(arr1, arr2)).toBeFalsy();
});

test('test 5: arrayDifference some', () => {
  expect(arrayDifference(arr1, arr2)).toEqual([3]);
});

test('test 5: arrayDifference none', () => {
  expect(arrayDifference(arr1, arr1)).toEqual([]);
});

test('test 5: arrayIntersection some', () => {
  expect(arrayIntersection(arr1, arr2)).toEqual([1, 2]);
});

test('test 5: arrayIntersection none', () => {
  expect(arrayIntersection(arr1, arr3)).toEqual([]);
});
