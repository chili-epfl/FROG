// @flow

import * as React from 'react';
import { CountChart, type LogDbT } from 'frog-utils';
import { sum } from 'lodash';

const Viewer = ({ state }: Object) => {
  const d = Object.values(state).reduce(
    (acc, val) => {
      if (val && typeof val === 'number') {
        acc[Math.min(Math.max(0, val), 5)] += 1;
      }
      return acc;
    },
    [0, 0, 0, 0, 0, 0]
  );
  const students = sum(Object.values(state));
  return (
    <div>
      <CountChart
        title="Number of per group"
        vAxis="Number of student of the group"
        hAxis="Number of groups"
        categories={['0', '1', '2', '3', '4', '>4']}
        data={d}
      />
      <p>Students in groups: {students}</p>
    </div>
  );
};

const mergeLog = (state: any, log: LogDbT) => {
  if (log.type === 'group.create') {
    state[log.itemId] = 1;
  }
  if (log.type === 'group.join') {
    if (!state[log.itemId]) {
      state[log.itemId] = 1;
    } else {
      state[log.itemId] += 1;
    }
  }
  if (log.type === 'group.leave') {
    if (!state[log.itemId]) {
      state[log.itemId] = 0;
    } else {
      state[log.itemId] -= 1;
    }
  }
};

const initData = {};

export default {
  dashboard: {
    Viewer,
    mergeLog,
    initData
  }
};
