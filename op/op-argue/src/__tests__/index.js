// @flow

import pkg from '../index';

const operator = pkg.operator;

const wrap = (instances, distanceMatrix) => ({
  activityData : {
    structure: 'all',
    payload: {
      all: {
        data: {
          instances,
          distanceMatrix
        }
      }
    }
  }

})

const test1 = wrap(
  ['s1','s2','s3','s4'],
  [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ]
)

const test2 = wrap(
  ['s1','s2','s3','s4'],
  [
    [0,5,0,5],
    [5,0,5,8],
    [0,5,0,5],
    [5,8,5,0]
  ]
)

const test3 = wrap(
  ['s1','s2','s3','s4','s5','s6'],
  [
    [0, 0, 0, 5, 3, 3],
    [0, 0, 0, 3, 5, 3],
    [0, 0, 0, 3, 3, 5],
    [5, 3, 3, 0, 0, 0],
    [3, 5, 3, 0, 0, 0],
    [3, 3, 5, 0, 0, 0]
  ]
)

test('test 1',
  () => expect(
    operator({},test1)
  ).toEqual({ group: { '1': ['s1','s2'], '2': ['s3','s4'] } })
);

test('test 2',
  () => expect(
    operator({},test2)
  ).toEqual({ group: { '1': ['s1','s2'], '2': ['s3','s4'] } })
);

test('test 3',
  () => expect(
    operator({},test3)
  ).toEqual({ group: { '1': ['s1','s4'], '2': ['s2','s5'], '3': ['s3','s6'] } })
);
