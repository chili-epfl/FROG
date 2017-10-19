// @flow

import { wrapUnitAll } from 'frog-utils';
import { compact } from 'lodash';
import pkg from '../index';

const operator = pkg.operator;

const config = {
  groupingKeys: 'first,last',
  defaultGroupingValues: '1,2',
  studentmapping: 'stian, 1,2\npeter, 2,1\njohn,3,1'
};

const globalStructure = {
  studentIds: ['1', '2', '3', '4'],
  students: { '1': 'stian', '2': 'peter', '3': 'john', '4': 'alfons' }
};

test('works', () =>
  expect(
    operator(config, {
      socialStructure: {},
      activityData: wrapUnitAll({}),
      globalStructure
    })
  ).toEqual({
    first: { '1': ['1', '4'], '2': ['2'], '3': ['3'] },
    last: { '1': ['2', '3'], '2': ['1', '4'] }
  }));

const globalStructure1 = {
  studentIds: [],
  students: {}
};

test('works with no students', () =>
  expect(
    operator(config, {
      socialStructure: {},
      activityData: wrapUnitAll({}),
      globalStructure: globalStructure1
    })
  ).toEqual({}));

const validateFormData = formData =>
  compact((pkg.validateConfig || []).map(x => x(formData)));

test('validate config, valid', () =>
  expect(
    validateFormData({
      groupingKeys: 'groups',
      defaultGroupingValues: '',
      studentmapping: 'stian,1\npeter,2'
    })
  ).toEqual([]));

test('validate config, one value too many', () =>
  expect(
    validateFormData({
      groupingKeys: 'groups',
      defaultGroupingValues: '1',
      studentmapping: 'stian,1,2\npeter,2'
    })
  ).toEqual([
    { err: 'Line stian,1,2 does not have right number of attributes' }
  ]));

test('validate config, one value too few', () =>
  expect(
    validateFormData({
      groupingKeys: 'groups, roles',
      defaultGroupingValues: '1',
      studentmapping: 'stian,1,2\npeter,2'
    })
  ).toEqual([
    { err: 'Line peter,2 does not have right number of attributes' }
  ]));
