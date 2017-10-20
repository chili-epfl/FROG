// @flow

import { distributeObjects } from '..';

test('Distribute to groups', () =>
  expect(
    distributeObjects(
      [
        { key: 'a', instanceId: 'x', category: 'l' },
        { key: 'b', instanceId: 'y', category: 'm' },
        { key: 'c', instanceId: 'y', category: 'l' }
      ],
      ['x', 'y'],
      ['l', 'm', 'n']
    )
  ).toEqual({
    x: {
      data: {
        b: { key: 'b', instanceId: 'y', category: 'm' },
        c: { key: 'c', instanceId: 'y', category: 'l' }
      }
    },
    y: {
      data: {
        a: { key: 'a', instanceId: 'x', category: 'l' }
      }
    }
  }));
