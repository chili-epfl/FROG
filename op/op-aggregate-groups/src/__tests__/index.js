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
          ididi1: { msg: 'hello', score: 1 },
          af1: { msg: 'hello', score: 1 }
        }
      },
      '2': {
        config: {},
        data: {
          ididi2: { msg: 'hello', score: 1 },
          af2: { msg: 'hello', score: 1 }
        }
      },
      '3': {
        config: {},
        data: {
          ididi3: { msg: 'hello', score: 1 },
          af3: { msg: 'hello', score: 1 }
        }
      },
      '4': {
        config: {},
        data: {
          ididi4: { msg: 'hello', score: 1 },
          af4: { msg: 'hello', score: 1 }
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

const config2 = {
  incomingGrouping: 'group',
  outgoingGrouping: 'combinedGroups'
};

test('deal with whole instance data', () => {
  expect(operator(config2, object2)).toEqual({
    payload: {
      a: {
        config: {},
        data: {
          af1: { msg: 'hello', score: 1 },
          af2: { msg: 'hello', score: 1 },
          ididi1: { msg: 'hello', score: 1 },
          ididi2: { msg: 'hello', score: 1 }
        }
      },
      b: {
        config: {},
        data: {
          af3: { msg: 'hello', score: 1 },
          af4: { msg: 'hello', score: 1 },
          ididi3: { msg: 'hello', score: 1 },
          ididi4: { msg: 'hello', score: 1 }
        }
      }
    },
    structure: { groupingKey: 'combinedGroups' }
  });
});
