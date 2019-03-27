import operator from '../operatorRunner';
import { object, object2 } from '../__fixture__';

test('Merge', () => {
  expect(operator({}, object)).toMatchSnapshot();
});

test('Merge when empty are not empty', () => {
  expect(operator({}, object2)).toMatchSnapshot();
});
