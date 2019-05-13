// @flow

import operator from '../operatorRunner';
import obj from '../__fixtures__';
import obj2 from '../__fixtures__/obj2';

const configData = {
  socialAttribute: 'roles'
};

test('Add categories', () =>
  expect(operator(configData, obj)).toMatchSnapshot());

test('Add categories, actual data', () =>
  expect(operator({ socialAttribute: 'role' }, obj2)).toMatchSnapshot());
