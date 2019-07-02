import lodash from 'lodash';

import operator from '../operatorRunner';

lodash.shuffle = jest.fn(x => [...x].sort());

const obj = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  socialStructure: {
    group: { g1: ['1', '2'], g2: ['3', '4'], g3: ['5', '6'], g4: ['7', '8'] }
  }
};

test('Create groups minimum', () =>
  expect(
    operator(
      { strategy: 'minimum', groupsize: 2, incomingGrouping: 'group' },
      obj
    )
  ).toEqual({
    groupCombined: { '1': ['1', '2', '3', '4'], '2': ['5', '6', '7', '8'] }
  }));

test('Create groups only 1', () =>
  expect(
    operator(
      { strategy: 'minimum', groupsize: 10, incomingGrouping: 'group' },
      obj
    )
  ).toEqual({
    groupCombined: { '1': ['1', '2', '3', '4', '5', '6', '7', '8'] }
  }));
