// @flow

import { getInstances } from '../activities';

const act = {};
const obj = {};

const Activities = { findOne: jest.fn(() => act) };
const Objects = { findOne: jest.fn(() => obj) };

test('Get instances', () => {
  expect(getInstances('1')).toEqual({});
});
