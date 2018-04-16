// @flow

import React from 'react';
import { Chart } from 'react-google-charts';

const Viewer = ({ state }: { state: Object }) => (
  <div>
    {state.idea && (
      <Chart
        chartType="BarChart"
        data={[
          ['Name', 'Count'],
          ...Object.keys(state.idea).map(key => [key, state.idea[key]])
        ]}
        width="100%"
        height="300px"
        options={{
          title: 'number of suggested ideas per group',
          bar: { groupWidth: '95%' },
          legend: { position: 'none' }
        }}
      />
    )}
    {state.vote && (
      <Chart
        chartType="BarChart"
        data={[
          ['Name', 'Count'],
          ...Object.keys(state.vote).map(key => [key, state.vote[key]])
        ]}
        width="100%"
        height="300px"
        options={{
          title: 'number of votes per student',
          bar: { groupWidth: '95%' },
          legend: { position: 'none' }
        }}
      />
    )}
  </div>
);

const mergeLog = (state: Object, log: Object) => {
  state[log.type] = state[log.type] || {};
  state[log.type][log.instanceId] = (state[log.type][log.instanceId] || 0) + 1;
};

export default { 'Event types': { initData: {}, mergeLog, Viewer } };
