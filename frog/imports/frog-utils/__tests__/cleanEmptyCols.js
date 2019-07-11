// @flow

import cleanEmptyCols from '../cleanEmptyCols';

const ex = 'header1\theader2\theader3\n1\t2\t3\n\t\t1';
const ex2 = 'header1\theader2\theader3\n1\t2\t3\n\t\t1\n1\t2\t3';
const ex3 = 'header1\theader2\theader3\n1\t\t3\n\t\t1';

test('works keeping all with some missing', () => {
  expect(cleanEmptyCols(ex)).toBe(ex);
});
test('works keeping all', () => {
  expect(cleanEmptyCols(ex2)).toBe(ex2);
});
test('works deleting one', () => {
  expect(cleanEmptyCols(ex3)).toBe('header1\theader3\n1\t3\n\t1');
});
