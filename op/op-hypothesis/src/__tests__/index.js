import { operator } from '../index';

jest.mock('frog-utils', () => {
  const createUUID = () => {
    let cntr = 0;
    return () => cntr++;
  };
  const uuid = createUUID();
  const frogutils = require.requireActual('frog-utils');
  return { ...frogutils, uuid };
});

test('Correctly parses API request results with contents', () =>
  expect(operator({ tag: 'reason' })).resolves.toMatchSnapshot());

test('Correctly parses API request results returning empty', () =>
  expect(operator({ tag: 'empty' })).resolves.toMatchSnapshot());
