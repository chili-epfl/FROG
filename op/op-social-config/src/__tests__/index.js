// @flow

import operator from '../operatorRunner';

const configData = {
  socialAttribute: 'group',
  path: 'title',
  matchings: [
    { socialValue: '1', configValue: 'Hi, welcome' },
    { socialValue: '2', configValue: 'How are you?' }
  ]
};

const object = {
  activityData: {
    structure: 'all',
    payload: { all: { data: {}, config: {} } }
  },
  socialStructure: {
    group: { '1': ['stud1'], '2': ['stud2'], '3': ['stud3'] }
  },
  globalStructure: {
    studentIds: ['stud1', 'stud2', 'stud3'],
    students: { vfAobH6K72pY7ucAp: 'Jean' }
  }
};

test('Distribute configs without default', () =>
  expect(operator(configData, object)).toEqual({
    payload: {
      '1': { config: { title: 'Hi, welcome' }, data: null },
      '2': { config: { title: 'How are you?' }, data: null },
      '3': { config: { title: null }, data: null }
    },
    structure: { groupingKey: 'group' }
  }));

test('Distribute configs with default', () =>
  expect(
    operator(
      { ...configData, provideDefault: true, defaultValue: 'Ni hao' },
      object
    )
  ).toEqual({
    payload: {
      '1': { config: { title: 'Hi, welcome' }, data: null },
      '2': { config: { title: 'How are you?' }, data: null },
      '3': { config: { title: 'Ni hao' }, data: null },
      default: { config: { title: 'Ni hao' }, data: null }
    },
    structure: { groupingKey: 'group' }
  }));
