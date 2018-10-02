import operator from '../operatorRunner';

jest.mock('frog-utils');

test('test empty', () =>
  expect(
    operator(
      {},
      {
        activityData: {
          structure: 'all',
          payload: { all: { data: { students: {} } } }
        },
        socialStructure: {},
        globalStructure: {
          studentIds: [],
          students: {}
        }
      }
    )
  ).toEqual({ group: {} }));

test('test almost empty', () =>
  expect(
    operator(
      {},
      {
        activityData: {
          structure: 'all',
          payload: { all: { data: { students: {} } } }
        },
        socialStructure: {},
        globalStructure: {
          studentIds: ['a'],
          students: {}
        }
      }
    )
  ).toEqual({ group: { SLU2: ['a'] } }));

const object = {
  activityData: {
    structure: 'all',
    payload: {
      all: {
        data: {
          students: {
            uid_chenli: 'LRKM',
            uid_maurice: 'LRKM'
          },
          groups: {
            LRKM: 'uid_chenli'
          }
        }
      }
    }
  },
  socialStructure: {},
  globalStructure: {
    studentIds: ['uid_chenli', 'uid_maurice', 'uid_peter']
  }
};

test('test students', () =>
  expect(operator({}, object)).toEqual({
    group: { LRKM: ['uid_chenli', 'uid_maurice'], SLU3: ['uid_peter'] }
  }));
