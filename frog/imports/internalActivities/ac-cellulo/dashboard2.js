import * as React from 'react';
import { EventChart } from './EventChart';

const Viewer = ({ sendMsg, state, activity }) => {
  return (
    <div>
      <EventChart events={state.events} />
    </div>
  );
};
const prepareDataForDisplay = state => state;
const mergeLog = (state, log) => {
  //log.Payload.positionx
  if (state.events.length < 2) {
    state.events.push([log.timestamp.getTime(), 'run']);
  } else if (log['type'] === 'log') {
    switch (log['data']['type']) {
      case 'cmd':
        state.events.push([
          ((log.timestamp.getTime() - state.events[1][0]) * 600) / 600000,
          log['data']['data'].cmd
        ]);
        break;
      default:
    }
  }
  console.log(state.events);
};
export default {
  initData: {
    events: new Array(1).fill(0).map(() => new Array(2).fill(0))
  },
  mergeLog,
  prepareDataForDisplay,
  Viewer
};
