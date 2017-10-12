import { flattenOne, splitPathObject } from '..';

test('flattenOne', () => {
  expect(flattenOne([1, 2, 3])).toEqual([1, 2, 3]);
  expect(flattenOne([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  expect(flattenOne([1, [2, [3, 9]], 4])).toEqual([1, 2, [3, 9], 4]);
});

test('splitPathObject', () => {
  expect(splitPathObject(
    {},
    ['a'],
    {}
  )).toEqual({
    insertPath: ['a'],
    insertObject: {}
  });
  expect(splitPathObject(
    {},
    ['a', 'b', 'c'],
    { hello: 'hello' }
  )).toEqual({
    insertPath: ['a'],
    insertObject: { b: { c: { hello: 'hello' } } }
  });
  expect(splitPathObject(
    { a: { d: 5 }},
    ['a', 'b', 'c', 'd', 'e'],
    0
  )).toEqual({
    insertPath: ['a', 'b'],
    insertObject: { c: { d: { e: 0 } } }
  });
  expect(splitPathObject(
    { a: { b: { c: { d: {}}} }},
    ['a', 'b', 'c', 'd', 'e'],
    0
  )).toEqual({
    insertPath: [ 'a', 'b', 'c', 'd', 'e' ],
    insertObject: 0
  });
});
