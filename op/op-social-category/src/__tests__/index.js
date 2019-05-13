// @flow

import operator from '../operatorRunner';
import obj from '../__fixtures__';

const configData = {
  socialAttribute: 'roles'
};

test('Add categories', () =>
  expect(operator(configData, obj)).toMatchSnapshot());
