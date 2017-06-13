// @flow

import React from 'react';
import { Chart } from 'react-google-charts';

export default ({ logs }: Object) => {
  const data = {};
  logs.forEach(log => {
    data[log.type] = data[log.type] || {};
    data[log.type][log.key] = (data[log.type][log.key] || 0) + 1;
  });

  return (
    <div>
      {idea &&
        <Chart
          chartType="BarChart"
          data={[
            ['Name', 'Count'],
            ...Object.keys(idea).map(key => [key, idea[key]])
          ]}
          width="100%"
          height="300px"
          options={{
            title: 'number of suggested ideas per group',
            bar: { groupWidth: '95%' },
            legend: { position: 'none' }
          }}
        />}
      {vote &&
        <Chart
          chartType="BarChart"
          data={[
            ['Name', 'Count'],
            ...Object.keys(vote).map(key => [key, vote[key]])
          ]}
          width="100%"
          height="300px"
          options={{
            title: 'number of votes per student',
            bar: { groupWidth: '95%' },
            legend: { position: 'none' }
          }}
        />}
    </div>
  );
};
