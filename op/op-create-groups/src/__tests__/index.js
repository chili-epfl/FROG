<<<<<<< HEAD
import lodash from 'lodash';

import { operator } from '../index';
=======
import { operator } from '../index';
import lodash from 'lodash';
>>>>>>> develop

lodash.shuffle = jest.fn(x => [...x].sort());

const obj = { globalStructure: { studentIds: ['1', '2', '3', '4', '5'] } };

test('Create groups minimum', () =>
  expect(operator({ strategy: 'minimum', groupsize: 2 }, obj)).toEqual({
    group: { '1': ['1', '2', '5'], '2': ['3', '4'] }
  }));

test('Create groups maximum', () =>
  expect(operator({ strategy: 'maximum', groupsize: 2 }, obj)).toEqual({
    group: { '1': ['1', '2'], '2': ['3', '4'], '3': ['5'] }
  }));

test('Create groups individual', () =>
  expect(operator({ strategy: 'maximum', groupsize: 1 }, obj)).toEqual({
    group: { '1': ['1'], '2': ['2'], '3': ['3'], '4': ['4'], '5': ['5'] }
  }));

const obj2 = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5', '6', '7', '8'] }
};
test('Create groups individual', () =>
  expect(operator({ strategy: 'minimum', groupsize: 3 }, obj2)).toEqual({
    group: { '1': ['1', '2', '3', '8'], '2': ['4', '5', '6', '7'] }
  }));
