import { getRotateable, flattenOne, splitPathObject } from '..';

jest.mock('..', () => require.requireActual('/../__mocks__/frog-utils.js'));

test('flattenOne', () => {
  expect(flattenOne([1, 2, 3])).toEqual([1, 2, 3]);
  expect(flattenOne([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  expect(flattenOne([1, [2, [3, 9]], 4])).toEqual([1, 2, [3, 9], 4]);
});

test('splitPathObject', () => {
  expect(splitPathObject({}, ['a'], {})).toEqual({
    insertPath: ['a'],
    insertObject: {}
  });
  expect(splitPathObject({}, ['a', 'b', 'c'], { hello: 'hello' })).toEqual({
    insertPath: ['a'],
    insertObject: { b: { c: { hello: 'hello' } } }
  });
  expect(
    splitPathObject({ a: { d: 5 } }, ['a', 'b', 'c', 'd', 'e'], 0)
  ).toEqual({
    insertPath: ['a', 'b'],
    insertObject: { c: { d: { e: 0 } } }
  });
  expect(
    splitPathObject(
      { a: { b: { c: { d: {} } } } },
      ['a', 'b', 'c', 'd', 'e'],
      0
    )
  ).toEqual({
    insertPath: ['a', 'b', 'c', 'd', 'e'],
    insertObject: 0
  });
});

test('getRotatable', () => {
  const rot = getRotateable(['a', 'b', 'c'], 1);
  expect([0, 1, 2, 3, 4, 5, 6].map(x => rot[x])).toEqual([
    'b',
    'c',
    'a',
    'b',
    'c',
    'a',
    'b'
  ]);
  const rot2 = getRotateable(['a', 'b', 'c'], 2);
  expect([0, 1, 2, 3, 4, 5, 6].map(x => rot2[x])).toEqual([
    'c',
    'a',
    'b',
    'c',
    'a',
    'b',
    'c'
  ]);
});
