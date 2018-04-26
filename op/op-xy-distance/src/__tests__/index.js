// @flow

import pkg from '../index';

const operator = pkg.operator;

const payload = {
  s1: { data: { coordinates: { x: 0, y: 0 } }, config: {} },
  s2: { data: { coordinates: { x: 3, y: 4 } }, config: {} },
  s3: { data: { coordinates: { x: 0, y: 0 } }, config: {} },
  s4: { data: { coordinates: { x: 3, y: -4 } }, config: {} }
};

test('Operator works with 0 students', () =>
  expect(
    operator(
      {},
      {
        socialStructure: {},
        globalStructure: { studentIds: Object.keys(payload), students: {} },
        activityData: { structure: 'individual', payload }
      }
    )
  ).toEqual({
    structure: 'all',
    payload: {
      all: {
        config: {},
        data: {
          distanceMatrix: [
            [0, 5, 0, 5],
            [5, 0, 5, 8],
            [0, 5, 0, 5],
            [5, 8, 5, 0]
          ]
        }
      }
    }
  }));
