import { flattenOne } from '..';

test('flattenOne', () => {
  expect(flattenOne([1, 2, 3])).toEqual([1, 2, 3]);
  expect(flattenOne([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  expect(flattenOne([1, [2, [3, 9]], 4])).toEqual([1, 2, [3, 9], 4]);
});
