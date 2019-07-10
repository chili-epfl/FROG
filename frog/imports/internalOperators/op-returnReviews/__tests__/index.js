import pkg from '../operatorRunner';
import { objectp2, result2 } from '../__fixtures__';

test('P2, 2 objects', () => {
  expect(pkg({}, objectp2)).toEqual(result2);
});
