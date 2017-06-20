import lodash from 'lodash';

import { operator } from '..';

const object = {
  globalStructure: { studentIds: [1, 2, 3, 4, 5] },
  socialStructure: {}
};

const expectedOutput = {
  group: { '0': ['1', '2'], '1': ['3', '4'], '2': ['5'] },
  role: { baker: ['2', '4'], chef: ['1', '3', '5'] }
};

const configData = { roles: 'chef, baker' };

lodash.shuffle = jest.fn(x => x.sort());

test('Works', () => {
  expect(operator(configData, object)).toEqual(expectedOutput);
});
