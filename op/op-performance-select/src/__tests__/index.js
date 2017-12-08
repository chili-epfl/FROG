import pkg from '..';

const config = {
  use_percentage: false,
  min_correct: 2,
  activity_low: 'act1',
  activity_high: 'act2'
};

const object = {
  activityData: {
    structure: 'individual',
    payload: {
      '28QHwrh25qvZ2Yr54': {
        data: {
          questions: ['a', 'f'],
          answers: ['s', 'a'],
          correctQs: [true, true],
          correctCount: 2,
          maxCorrect: 2
        }
      },
      uaCMyK6DJtsut5zGm: {
        data: {
          questions: ['a', 'f'],
          answers: ['l', 'a'],
          correctQs: [false, true],
          correctCount: 1,
          maxCorrect: 2
        }
      }
    }
  },
  socialStructure: {},
  globalStructure: {
    studentIds: ['28QHwrh25qvZ2Yr54', 'uaCMyK6DJtsut5zGm'],
    students: { '28QHwrh25qvZ2Yr54': 'Ahmed', uaCMyK6DJtsut5zGm: 'Leon' }
  }
};

test('split in two', () => {
  expect(pkg.operator(config, object)).toEqual({
    list: {
      act1: {
        mode: 'include',
        payload: { uaCMyK6DJtsut5zGm: true },
        structure: 'individual'
      },
      act2: {
        mode: 'include',
        payload: { '28QHwrh25qvZ2Yr54': true },
        structure: 'individual'
      }
    }
  });
});
