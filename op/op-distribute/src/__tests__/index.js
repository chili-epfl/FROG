import lodash from 'lodash';

import pkg from '../index';

const operator = pkg.operator;

lodash.shuffle = jest.fn(x => [...x].sort());

const socStruct = { group: { '1': ['1', '2', '5'], '2': ['3', '4'] } };

// grouping attrib, maxitems, overlap(?)

const object = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5'] },
  socialStructure: socStruct,
  activityData: {
    structure: 'all',
    payload: { all: { data: ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg'] } }
  }
};

test('Distribute 2 to each group', () =>
  expect(
    operator({ grouping: 'group', maxitems: 2, overlap: false }, { ...object })
  ).toEqual({
    payload: { '1': { data: ['gg', 'ee'] }, '2': { data: ['ff', 'dd'] } },
    structure: { groupingKey: 'group' }
  }));

test('Distribute 5 to each group, no overlap', () => {
  expect(
    operator({ grouping: 'group', maxitems: 5, overlap: false }, { ...object })
  ).toEqual({
    payload: {
      '1': { data: ['gg', 'ee', 'cc', 'aa'] },
      '2': { data: ['ff', 'dd', 'bb'] }
    },
    structure: { groupingKey: 'group' }
  });
});

test('Distribute 5 to each group,  overlap', () => {
  expect(
    operator({ grouping: 'group', maxitems: 5, overlap: true }, { ...object })
  ).toEqual({
    payload: {
      '1': { data: ['aa', 'bb', 'cc', 'dd', 'ee'] },
      '2': { data: ['aa', 'bb', 'cc', 'dd', 'ee'] }
    },
    structure: { groupingKey: 'group' }
  });
});

test('Distribute 2 to each student, overlap', () => {
  expect(
    operator({ maxitems: 2, overlap: true, individual: true }, { ...object })
  ).toEqual({
    payload: {
      '1': { data: ['aa', 'bb'] },
      '2': { data: ['aa', 'bb'] },
      '3': { data: ['aa', 'bb'] },
      '4': { data: ['aa', 'bb'] },
      '5': { data: ['aa', 'bb'] }
    },
    structure: 'individual'
  });
});

const object2 = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5'] },
  socialStructure: socStruct,
  activityData: {
    structure: 'all',
    payload: { all: { data: { text: 'aa' } } }
  }
};

test('Refuses to sort an object', () => {
  expect(() =>
    operator({ maxitems: 2, overlap: true, individual: true }, object2)
  ).toThrow();
});
