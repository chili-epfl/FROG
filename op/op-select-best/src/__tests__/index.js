// @flow

import operator from '../operatorRunner';
jest.mock('frog-utils');

const object2 = {
  _id: 'cjgccn7m5000ik7j4g5i6uc2i',
  activityData: {
    structure: { groupingKey: 'group' },
    payload: {
      '1': {
        config: {},
        data: {
          ididi1: { msg: 'hello', score: 10 },
          af1: { msg: 'hello', score: 1 }
        }
      },
      '2': {
        config: {},
        data: {
          ididi2: { msg: 'hello', score: -1 },
          af2: { msg: 'hello', score: 1 }
        }
      },
      '3': {
        config: {},
        data: {
          ididi3: { msg: 'hello', score: 1 },
          af3: { msg: 'hello', score: 2 }
        }
      },
      '4': {
        config: {},
        data: {
          ididi4: { msg: 'hello', score: 1 },
          af4: { msg: 'hello' }
        }
      }
    }
  },
  socialStructure: {
    group: {
      '1': ['1', '2'],
      '2': ['3', '4'],
      '3': ['5', '6'],
      '4': ['7', '8']
    },
    combinedGroups: {
      a: ['1', '2', '3', '4'],
      b: ['5', '6', '7', '8']
    }
  }
};

test('deal with whole instance data', () => {
  expect(operator({ topN: 1 }, object2)).toEqual({
    payload: {
      '1': { config: {}, data: { '1': { id: 1, msg: 'hello', score: 10 } } },
      '2': { config: {}, data: { '2': { id: 2, msg: 'hello', score: 1 } } },
      '3': { config: {}, data: { '3': { id: 3, msg: 'hello', score: 2 } } },
      '4': { config: {}, data: { '4': { id: 4, msg: 'hello', score: 1 } } }
    },
    structure: { groupingKey: 'group' }
  });
});

const activityData = {
  structure: {
    groupingKey: 'group'
  },
  payload: {
    '1': {
      data: {
        cjmbpp0mm0015hkixocmtmtzl: {
          students: {},
          score: 0,
          id: 'cjmbpp0mm0015hkixocmtmtzl',
          li: 'cjmbporf000023h6kjun0fs6q'
        }
      }
    },
    '2': {
      data: {}
    },
    '3': {
      data: {
        cjmbpp0mr0016hkixb0254z5l: {
          students: {},
          score: 0,
          id: 'cjmbpp0mr0016hkixb0254z5l',
          li: 'cjmbpordi00023h6knkwctqjo'
        }
      }
    },
    '4': {
      data: {
        cjmbpp0mt0018hkixceq0z8z5: {
          students: {
            '7vMRxYmHGg7neWBNa': 1
          },
          score: 1,
          id: 'cjmbpp0mt0018hkixceq0z8z5',
          li: 'cjmbporen00023h6kcd3m5ey8'
        },
        cjmbpp0ms0017hkixbhwfqw7p: {
          students: {},
          score: 0,
          id: 'cjmbpp0ms0017hkixbhwfqw7p',
          li: 'cjmbporc800023h6kgovfpway'
        }
      }
    }
  }
};

test('test2', () => {
  expect(operator({ topN: 1 }, { activityData })).toEqual({
    payload: {
      '1': {
        data: {
          cjmbpp0mm0015hkixocmtmtzl: {
            id: 'cjmbpp0mm0015hkixocmtmtzl',
            li: 'cjmbporf000023h6kjun0fs6q',
            score: 0,
            students: {}
          }
        }
      },
      '2': { data: {} },
      '3': {
        data: {
          cjmbpp0mr0016hkixb0254z5l: {
            id: 'cjmbpp0mr0016hkixb0254z5l',
            li: 'cjmbpordi00023h6knkwctqjo',
            score: 0,
            students: {}
          }
        }
      },
      '4': {
        data: {
          cjmbpp0mt0018hkixceq0z8z5: {
            id: 'cjmbpp0mt0018hkixceq0z8z5',
            li: 'cjmbporen00023h6kcd3m5ey8',
            score: 1,
            students: { '7vMRxYmHGg7neWBNa': 1 }
          }
        }
      }
    },
    structure: { groupingKey: 'group' }
  });
});
