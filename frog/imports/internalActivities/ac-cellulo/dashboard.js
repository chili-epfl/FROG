import * as React from 'react';

import { HeatMap } from './heatMap';

const Viewer = ({ sendMsg, state, activity }) => {
  return (
    <div>
      <HeatMap Data={state.gridTable} />

      <h1>Aggregated heatmap</h1>
      <button onClick={() => sendMsg('alarm')}>Alarm</button>
    </div>
  );
};
const Numofteams = 2;
const widthGridTable = 10;
const heightGridTable = 10;
const prepareDataForDisplay = state => state;
const mergeLog = (state, log) => {
  //log.Payload.positionx
  console.log(state.gridTable);
};
export default {
  initData: {
    gridTable: new Array(heightGridTable)
      .fill(0)
      .map(() => new Array(widthGridTable).fill(0))
  },
  mergeLog,
  prepareDataForDisplay,
  Viewer
};
