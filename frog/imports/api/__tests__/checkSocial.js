// @flow

import valid from '../validGraphFn';

const activities3 = [{ _id: 'a1', activityType: 'ac-chat' }];
const connections3 = [
  { _id: 'c1', target: { id: 'a1' }, source: { id: 'o4' } }
];

test('checking that period in social attribute triggers error', () => {
  expect(
    valid(
      activities3,
      [
        {
          _id: 'o4',
          target: { id: 'a1' },
          type: 'social',
          operatorType: 'op-create-groups',
          data: { grouping: 'role.group', groupsize: 2, strategy: 'minimum' }
        }
      ],
      connections3
    )
  ).toEqual({
    errors: [
      {
        err:
          'The name of social attribute role.group contains a period, this is not allowed.',
        id: 'o4',
        severity: 'error',
        type: 'socialAttributeWithPeriod'
      }
    ],
    social: { a1: ['role.group'] }
  });
});
