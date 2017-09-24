// @flow

import pkg from '../index';

const operator = pkg.operator;

const config = {
  groupnames: 'first,last',
  defaultgroup: '1,2',
  studentmapping: 'stian, 1,2\npeter, 2,1\njohn,3,1'
};

const globalStructure = {
  studentIds: [1, 2, 3, 4],
  students: { '1': 'stian', '2': 'peter', '3': 'john', '4': 'alfons' }
};

test('works', () =>
  expect(operator(config, { globalStructure })).toEqual({
    first: { '1': ['1', '4'], '2': ['2'], '3': ['3'] },
    last: { '1': ['2', '3'], '2': ['1', '4'] }
  }));
