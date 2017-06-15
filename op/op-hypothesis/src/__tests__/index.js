// @flow
import { operator } from '../index';

test('Correctly parses API request results', () =>
  expect(operator({ tag: 'reason' })).resolves.toMatchSnapshot());
