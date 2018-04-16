// @flow

import React from 'react';
import { CountChart, type LogDBT } from 'frog-utils';

const actionTypes = ['dragdrop-upload', 'webcam-upload', 'vote', 'zoom'];

const Viewer = ({ state }: Object) => {
  return (
    <div>
      {state.map((d, i) => (
        <CountChart
          key={actionTypes[i]}
          title={'Number of ' + actionTypes[i] + ' per group'}
          vAxis={'Number of ' + actionTypes[i]}
          hAxis="Number of groups"
          categories={['0', '1', '2', '3', '4', '>4']}
          data={d}
        />
      ))}
    </div>
  );
};

const prepareDisplay = (state: Object) =>
  state &&
  actionTypes.map(actionType =>
    Object.keys(state).reduce(
      (acc, val) => {
        const count = state[val] ? state[val][actionType] : -1;
        if (Number.isInteger(count) && count > -1) {
          acc[Math.min(Math.max(0, count), 5)] += 1;
        }
        return acc;
      },
      [0, 0, 0, 0, 0, 0]
    )
  );

const mergeLog = (state: any, log: LogDBT) => {
  const action = log.type;
  if (actionTypes.includes(action)) {
    if (!state[log.instanceId]) {
      state[log.instanceId] = actionTypes.reduce(
        (acc, i) => ({ ...acc, [i]: 0 }),
        {}
      );
    }
    state[log.instanceId][action] += 1;
  }
};

const initData = {};

export default {
  dashboard: {
    Viewer,
    mergeLog,
    initData,
    prepareDisplay
  }
};
