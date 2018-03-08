// @flow

import pkg from '../index';

const operator = pkg.operator;

const payload = {
  student1: { data: { coordinates: { x:0, y: 0 }}},
  student2: { data: { coordinates: { x:3, y: 4 }}},
  student3: { data: { coordinates: { x:0, y: 0 }}},
  student4: { data: { coordinates: { x:3, y: -4 }}}
}

test('Operator works with 0 students', () =>
  expect(
    operator(
      {},
      {
        socialStructure: {},
        globalStructure: { studentIds: [], students: {} },
        activityData: { structure: 'individual', payload }
      }
    )
  ).toEqual({
    structure: 'all',
    payload: {
      all: {
        data: {
          instances: ['student1','student2','student3','student4'],
          distanceMatrix: [
            [0,5,0,5],
            [5,0,5,8],
            [0,5,0,5],
            [5,8,5,0]
          ]
        }
      }
    }
  }));
