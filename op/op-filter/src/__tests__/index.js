// @flow

import { objFilter } from '..';

const obj = {
  selected: true,
  category: 'trash',
  payload: 'hello world'
};

test('objFilter', () => {
  expect(objFilter({ field: 'selected' }, obj)).toEqual(true);
  expect(objFilter({ field: 'selected', remove: true }, obj)).toEqual(false);
  expect(objFilter({ field: 'category' }, obj)).toEqual(true);
  expect(
    objFilter({ field: 'category', value: 'trash', remove: false }, obj)
  ).toEqual(true);
  expect(
    objFilter({ field: 'category', value: 'trash', remove: true }, obj)
  ).toEqual(false);
  expect(
    objFilter({ field: 'payload', value: 'random', remove: true }, obj)
  ).toEqual(true);
  expect(objFilter({ field: 'payload', remove: false }, obj)).toEqual(true);
  expect(objFilter({ field: 'payload', remove: true }, obj)).toEqual(false);
});

test('Test removeUndefined', () => {
  expect(objFilter({ field: 'payload', removeUndefined: true }, obj)).toEqual(
    true
  );
  expect(objFilter({ field: 'nope', removeUndefined: true }, obj)).toEqual(
    false
  );
  expect(objFilter({ field: 'nope', removeUndefined: false }, obj)).toEqual(
    false
  );
  expect(
    objFilter({ field: 'nope', remove: true, removeUndefined: false }, obj)
  ).toEqual(true);
});
