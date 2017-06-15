// @flow
import { operator } from '../index';

test('Correctly parses API request results with contents', () =>
  expect(operator({ tag: 'reason' })).resolves.toMatchSnapshot());

test('Correctly parses API request results returning empty', () =>
  expect(operator({ tag: 'empty' })).resolves.toMatchSnapshot());
