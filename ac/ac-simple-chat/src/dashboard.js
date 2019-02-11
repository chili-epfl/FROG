// @flow

import React from 'react';
import { type LogDbT, type DashboardT } from 'frog-utils';

const Viewer = ({ state, users }: Object) => (
  <>
    <h1>Number of characters per user</h1>
    {Object.keys(state).map(u => (
      <li key={u}>
        {users[u]}: {state[u]}
      </li>
    ))}
  </>
);

const mergeLog = (state: Object, log: LogDbT) => {
  if (log.type === 'said' && typeof log.value === 'string') {
    if (!state[log.userId]) {
      state[log.userId] = log.value.length;
    } else {
      state[log.userId] += log.value.length;
    }
  }
};

const initData = {};

const words: DashboardT = {
  Viewer,
  mergeLog,
  initData
};

export default { words };
