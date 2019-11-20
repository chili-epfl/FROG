// @flow

import operator from '../operatorRunner';

const payload = {
  G6QjT87QBhyF4wnMo: {
    data: {
      answers: {
        G6QjT87QBhyF4wnMo: { A: 1, BB: 2, CCC: 3, DDDD: 4, EEEEE: 5 }
      }
    }
  },
  ZzYgmJkvuugv7BfLw: {
    data: {
      answers: { ZzYgmJkvuugv7BfLw: { DDDD: 1, EEEEE: 2 } }
    }
  },
  eAuSCJbcShEbHNgmj: {
    data: {
      answers: { eAuSCJbcShEbHNgmj: { A: 1, CCC: 2, DDDD: 3 } }
    }
  },
  pTNa8W776KB9pWQbH: {
    data: {
      answers: { pTNa8W776KB9pWQbH: { EEEEE: 1, DDDD: 2, CCC: 3, BB: 4, A: 5 } }
    }
  }
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
            [0, 18, 2, 40],
            [18, 0, 4, 2],
            [2, 4, 0, 18],
            [40, 2, 18, 0]
          ]
        }
      }
    }
  }));
