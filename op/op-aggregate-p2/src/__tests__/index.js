// @flow

import pkg from '../index';

const object = {
  _id: 'cjgccn7m5000ik7j4g5i6uc2i',
  activityData: {
    structure: 'individual',
    payload: {
      '2vxRoyvvKJY3dpEDd': {
        config: {},
        data: {
          justification: '',
          answers: {
            '2vxRoyvvKJY3dpEDd': {}
          },
          group: {
            '2vxRoyvvKJY3dpEDd': 'Jan'
          },
          msg:
            'Jan ranked the interfaces in the following order: , with the justification'
        }
      },
      J29phNHao76KzhiAY: {
        config: {},
        data: {
          justification: '',
          answers: {
            J29phNHao76KzhiAY: {}
          },
          group: {
            J29phNHao76KzhiAY: 'Leon'
          },
          msg:
            'Leon ranked the interfaces in the following order: , with the justification '
        }
      },
      student3: {
        config: {},
        data: {
          justification: '',
          msg: 'Just a simple message'
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
    studentIds: ['J29phNHao76KzhiAY', '2vxRoyvvKJY3dpEDd', 'student3'],
    students: {
      J29phNHao76KzhiAY: 'Leon',
      '2vxRoyvvKJY3dpEDd': 'Jan',
      student3: 'Student 3'
    }
  }
};

const config = { grouping: 'group', wholeElement: true };

test('deal with whole instance data', () => {
  expect(pkg.operator(config, object)).toEqual({
    payload: {
      '1': {
        config: {},
        data: [
          {
            answers: { '2vxRoyvvKJY3dpEDd': {} },
            group: { '2vxRoyvvKJY3dpEDd': 'Jan' },
            justification: '',
            msg:
              'Jan ranked the interfaces in the following order: , with the justification'
          },
          {
            answers: { J29phNHao76KzhiAY: {} },
            group: { J29phNHao76KzhiAY: 'Leon' },
            justification: '',
            msg:
              'Leon ranked the interfaces in the following order: , with the justification '
          }
        ]
      },
      '2': {
        config: {},
        data: [{ justification: '', msg: 'Just a simple message' }]
      }
    },
    structure: { groupingKey: 'group' }
  });
});

const object2 = {
  _id: 'cjgccn7m5000ik7j4g5i6uc2i',
  activityData: {
    structure: 'individual',
    payload: {
      '2vxRoyvvKJY3dpEDd': {
        config: {},
        data: {
          ididi: { msg: 'hello' },
          pap33: { msg: 'hi' }
        }
      },
      J29phNHao76KzhiAY: {
        config: {},
        data: {
          i3idi: { msg: 'ciao cara' },
          p4p33: { msg: 'dobriy dyen' }
        }
      },
      student3: {
        config: {},
        data: {
          j3434: { msg: '3403' },
          f4343: { msg: '0440' }
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

const config2 = { grouping: 'group' };

test('deal with whole instance data', () => {
  expect(pkg.operator(config2, object2)).toEqual({
    payload: {
      '1': {
        config: {},
        data: [
          { msg: 'hello' },
          { msg: 'hi' },
          { msg: 'ciao cara' },
          { msg: 'dobriy dyen' }
        ]
      },
      '2': {
        config: {},
        data: [{ msg: '3403' }, { msg: '0440' }]
      }
    },
    structure: { groupingKey: 'group' }
  });
});
