import pkg from '../operatorRunner';
import { objectp2, result2 } from '../__fixtures__';

jest.mock('/imports/frog-utils', () =>
  require.requireActual('/../__mocks__/frog-utils.js')
);

test('P2, 2 objects', () => {
  expect(pkg({}, objectp2)).toEqual(result2);
});
