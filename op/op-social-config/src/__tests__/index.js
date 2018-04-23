// @flow

import pkg from '../index';

const configData = {
  socialAttribute: 'group',
  path: 'title',
  matchings: [
    { socialValue: '1', configValue: 'Hi, welcome' },
    { socialValue: '2', configValue: 'How are you?' }
  ]
};

const object = {
  activityData: { structure: 'all', payload: { all: {} } },
  socialStructure: {
    group: { '1': ['stud1'], '2': ['stud2'], '3': ['stud3'] }
  },
  globalStructure: {
    studentIds: ['stud1', 'stud2', 'stud3'],
    students: { vfAobH6K72pY7ucAp: 'Jean' }
  }
};

test('Distribute configs without default', () =>
  expect(pkg.operator(configData, object)).toEqual({
    payload: {
      '1': { config: { title: 'Hi, welcome' } },
      '2': { config: { title: 'How are you?' } },
      '3': { config: { title: null } }
    },
    structure: { groupingKey: 'group' }
  }));

test('Distribute configs with default', () =>
  expect(
    pkg.operator(
      { ...configData, provideDefault: true, default: 'Ni hao' },
      object
    )
  ).toEqual({
    payload: {
      '1': { config: { title: 'Hi, welcome' } },
      '2': { config: { title: 'How are you?' } },
      '3': { config: { title: 'Ni hao' } }
    },
    structure: { groupingKey: 'group' }
  }));
