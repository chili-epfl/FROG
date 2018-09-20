// @flow

import operator from '../operatorRunner';
jest.mock('frog-utils');

const object2 = {
  _id: 'cjgccn7m5000ik7j4g5i6uc2i',
  activityData: {
    structure: 'individual',
    payload: {
      '2vxRoyvvKJY3dpEDd': {
        config: {},
        data: {
          ididi: { msg: 'hello', score: 1 },
          pap33: { msg: 'hi', score: 0 }
        }
      },
      J29phNHao76KzhiAY: {
        config: {},
        data: {
          i3idi: { msg: 'ciao cara', score: 1 },
          p4p33: { msg: 'dobriy dyen' }
        }
      },
      student3: {
        config: {},
        data: {
          j3434: { msg: '3403' },
          j3435: { msg: '34031', score: 3 },
          j3436: { msg: '34032', score: 2 },
          f4343: { msg: '04403', score: 1 }
        }
      }
    }
  },
  socialStructure: {
    group: {
      '1': ['J29phNHao76KzhiAY', '2vxRoyvvKJY3dpEDd'],
      '2': ['student3']
    }
  },
  globalStructure: {
    studentIds: ['J29phNHao76KzhiAY', '2vxRoyvvKJY3dpEDd'],
    students: {
      J29phNHao76KzhiAY: 'Leon',
      '2vxRoyvvKJY3dpEDd': 'Jan',
      student3: 'Student 3'
    }
  }
};

const config2 = { grouping: 'group', chooseTop: true, topN: 1 };

test('deal with whole instance data', () => {
  expect(operator(config2, object2)).toEqual({
    payload: {
      all: {
        config: {},
        data: {
          '1': { id: 1, msg: 'hello', score: 1 },
          '2': { id: 2, msg: 'ciao cara', score: 1 },
          '3': { id: 3, msg: '34031', score: 3 }
        }
      }
    },
    structure: 'all'
  });
});
