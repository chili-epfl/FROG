import lodash from 'lodash';

import operator from '../operatorRunner';

lodash.shuffle = jest.fn(x => [...x].sort());

const socStruct = { group: { '1': ['1', '2', '5'], '2': ['3', '4'] } };

// grouping attrib, maxitems, overlap(?)

const object = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5'] },
  socialStructure: socStruct,
  activityData: {
    structure: 'all',
    payload: {
      all: {
        data: {
          aa: { id: 'aa' },
          bb: { id: 'bb' },
          cc: { id: 'cc' },
          dd: { id: 'dd' },
          ee: { id: 'ee' },
          ff: { id: 'ff' },
          gg: { id: 'gg' }
        }
      }
    }
  }
};

test('Distribute 2 to each group', () =>
  expect(
    operator({ grouping: 'group', maxitems: 2, overlap: false }, { ...object })
  ).resolves.toEqual({
    payload: {
      '1': { data: { ee: { id: 'ee' }, gg: { id: 'gg' } } },
      '2': { data: { dd: { id: 'dd' }, ff: { id: 'ff' } } }
    },
    structure: { groupingKey: 'group' }
  }));

test('Distribute 5 to each group, no overlap', () => {
  return expect(
    operator({ grouping: 'group', maxitems: 5, overlap: false }, { ...object })
  ).resolves.toMatchSnapshot();
});

test('Distribute 5 to each group,  overlap', () => {
  return expect(
    operator({ grouping: 'group', maxitems: 5, overlap: true }, { ...object })
  ).resolves.toMatchSnapshot();
});

test('Distribute 2 to each student, overlap', () => {
  return expect(
    operator({ maxitems: 2, overlap: true, individual: true }, { ...object })
  ).resolves.toMatchSnapshot();
});
