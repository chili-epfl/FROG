import * as React from 'react';
const Viewer = ({ sendMsg, state, activity }) => {
  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Classroom Summary of Robots movement</h1>
      <h1>Aggregated heatmap</h1>
      <button onClick={() => sendMsg('alarm')}>Alarm</button>
    </div>
  );
};
const widthGridTable = 10;
const heightGridTable = 10;
const prepareDataForDisplay = state => state;
const mergeLog = (state, log) => {
  state.gridTable[1][4] = 3;
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
