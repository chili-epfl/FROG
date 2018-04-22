// @flow

import valid from '../validGraphFn';

const activities1 = {
  _id: 'a1',
  activityType: 'ac-chat',
  streamTarget: 'a2',
  startTime: 5
};
const activities1b = {
  _id: 'a1',
  activityType: 'ac-chat',
  streamTarget: 'a3',
  startTime: 5
};
const activities2 = { _id: 'a2', activityType: 'ac-chat', startTime: 4 };
const activities3 = { _id: 'a3', activityType: 'ac-chat', startTime: 10 };

const graph1 = [activities1, activities2];

const graph2 = [activities1b, activities3];

test('checking that normal stream target is ok', () => {
  expect(valid(graph1, [], [])).toEqual({
    errors: [],
    social: {}
  });
});

test('checking that illegal stream target is not ok', () => {
  expect(valid(graph2, [], [])).toEqual({
    errors: [
      {
        err:
          'Streaming target has a later start time than the streaming source',
        id: 'a1',
        nodeType: 'activity',
        severity: 'error',
        type: 'streamTargetOpensLate'
      }
    ],
    social: {}
  });
});
