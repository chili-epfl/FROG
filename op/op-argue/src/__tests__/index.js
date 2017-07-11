import lodash from 'lodash';

import pkg from '../index';

const operator = pkg.operator;

//lodash.shuffle = jest.fn(x => [...x].sort());

//const obj = { globalStructure: { studentIds: ['1', '2', '3', '4', '5'] } };
const obj1 = {
  students: [
    ['A','A','C'],
    ['B','C','C'],
    ['A','B','C'],
    ['B','C','A']
  ]
};

const expected1 = [['0', '3'],['1', '2']];

test('Test 1, normal case: 4 students, 3 answers', () =>
  expect(operator({}, obj1)).toEqual(expected1));
