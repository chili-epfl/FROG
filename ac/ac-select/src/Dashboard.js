// @flow

import * as React from 'react';
import { type DashboardT, type LogDbT } from 'frog-utils';

const Viewer = ({ state }) => (
  <table>
    <thead>
      <tr>
        <td style={{ border: 'solid 2px' }}>Word</td>
        <td style={{ border: 'solid 2px' }}>N° of highlights</td>
      </tr>
    </thead>
    <tbody>
      {Object.keys(state)
        .filter(x => state[x] > 0)
        .sort((a, b) => (state[a] > state[b] ? -1 : 1))
        .map(word => (
          <tr key={word}>
            <td style={{ border: 'solid 1px' }}>
              {word}
              <div />
            </td>
            <td style={{ border: 'solid 1px', borderLeft: 'none' }}>
              {state[word]}
            </td>
          </tr>
        ))}
    </tbody>
  </table>
);

const mergeLog = (state: any, log: LogDbT) => {
  switch (log.type) {
    case 'plus':
      state[log.value] = state[log.value] ? (state[log.value] += 1) : 1;
      break;
    case 'minus':
      state[log.value] -= 1;
      break;
    default:
  }
};

const initData = {};

const dashboard: DashboardT = {
  Viewer,
  mergeLog,
  initData
};

export default { dashboard };
