// @flow

import React from 'react';
import { CountChart, type LogDbT, type DashboardT } from 'frog-utils';
import leaderboard from './Leaderboard';

const actionTypes = ['dragdrop-upload', 'webcam-upload', 'vote', 'zoom'];

const Viewer = ({ state }: Object) => {
  const chartData =
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
  return (
    <div>
      {chartData &&
        chartData.map((d, i) => (
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

const mergeLog = (state: any, log: LogDbT) => {
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

const dashboard: DashboardT = { Viewer, mergeLog, initData };

export default { dashboard, leaderboard };
