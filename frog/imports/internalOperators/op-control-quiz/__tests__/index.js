// @ flow

import operator from '../operatorRunner';

const obj = {
  activityData: {
    payload: {
      User_1: { data: { answers: [] } },
      User_2: { data: { answers: ['Y'] } },
      User_3: { data: { answers: ['N', 'Y'] } },
      User_4: { data: { answers: ['N', 'N'] } }
    }
  },
  globalStructure: {},
  socialStructure: {}
};

test('Test 1', () =>
  expect(
    operator({ mode: 'include', questionIndex: 0, answer: 'N' }, obj)
  ).toEqual({
    all: {
      mode: 'include',
      payload: { User_3: true, User_4: true },
      structure: 'individual'
    }
  }));

test('Test 2', () =>
  expect(
    operator({ mode: 'exclude', questionIndex: 0, answer: 'K' }, obj)
  ).toEqual({
    all: {
      mode: 'exclude',
      payload: {},
      structure: 'individual'
    }
  }));

test('Test 3', () =>
  expect(
    operator({ mode: 'include', questionIndex: -5, answer: 'Y' }, obj)
  ).toEqual({
    all: {
      mode: 'include',
      payload: {},
      structure: 'individual'
    }
  }));

test('Test 4', () =>
  expect(
    operator({ mode: 'exclude', questionIndex: 1, answer: 'Y' }, obj)
  ).toEqual({
    all: {
      mode: 'exclude',
      payload: { User_3: true },
      structure: 'individual'
    }
  }));
