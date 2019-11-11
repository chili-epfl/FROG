import * as React from 'react';

import { HeatMap } from './heatMap';

const Viewer = ({ sendMsg, state, activity }) => {
  const data = [
    {
      name: 'Round 1',
      values: [
        {
          id: 1,
          label: 'Test 1',
          value: 0,
          color: 'red'
        },
        {
          id: 2,
          label: 'Test 2',
          value: 0,
          color: ['yellow', 'green']
        }
      ]
    },
    {
      name: 'Round 2',
      values: [
        {
          id: 1,
          label: 'Test 1',
          value: 10,
          color: 'red'
        },
        {
          id: 2,
          label: 'Test 2',
          value: 5,
          color: ['yellow', 'green']
        }
      ]
    },
    {
      name: 'Round 3',
      values: [
        {
          id: 1,
          label: 'Test 1',
          value: 12,
          color: 'red'
        },
        {
          id: 2,
          label: 'Test 2',
          value: 21,
          color: ['yellow', 'green']
        }
      ]
    }
  ];
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
