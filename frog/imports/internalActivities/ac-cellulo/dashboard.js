import * as React from 'react';
import { HeatMap } from './heatMap';
import { EventChart } from './EventChart';
import AppH from './components/app';

const Viewer = ({ sendMsg, state, activity }) => {
  return (
    <div>
      <AppH />
    </div>
  );
};
const Numofteams = 2;
const widthGridTable = 10;
const heightGridTable = 10;
const prepareDataForDisplay = state => state;
const mergeLog = (state, log) => {
  //log.Payload.positionx
  if (state.events.length > 43) {
    state.events.push([
      ((log.timestamp.getTime() - state.events[43][0]) * 300) / 600000,
      'run'
    ]);
  } else {
    state.events.push([log.timestamp.getTime(), 'run']);
  }
  //console.log(log.timestamp.getTime() - state.events[15][0]);
  if (log.Payload.positionx) {
    state.gridTable[Number((log.Payload.positionx / 10).toFixed(0))][0] =
      state.gridTable[Number((log.Payload.positionx / 10).toFixed(0))][0] + 1;
  }
  console.log(Number((6.388689).toFixed(0)));
  console.log(state.events.length);
  console.log(log);
  console.log(state.gridTable);
};
export default {
  initData: {
    gridTable: new Array(heightGridTable)
      .fill(0)
      .map(() => new Array(widthGridTable).fill(0)),
    events: new Array(1).fill(0).map(() => new Array(2).fill(0))
  },
  mergeLog,
  prepareDataForDisplay,
  Viewer
};
