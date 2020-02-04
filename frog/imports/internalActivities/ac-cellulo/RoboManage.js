import * as React from 'react';
import { EventChart } from './EventChart';

const Viewer = ({ sendMsg, state, activity }) => {
  return (
    <div>
      <h1>Important Robotic Events</h1>
      {state.map((x, i) => (
        <li key={i}>
          "Team"+{x[0]}+is+{x[1]}
        </li>
      ))}
      <h1>Robot Bank</h1>
    </div>
  );
};
const prepareDataForDisplay = state => state;
const mergeLog = (state, log) => {
  if ('RobotStatus' in log) {
    state.push([log.ID.TeamNumber, log.RobotStatus.alarms]);
  }
};
export default {
  initData: new Array(1).fill(0).map(() => new Array(2)),
  mergeLog,
  prepareDataForDisplay,
  Viewer
};
