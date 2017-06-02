// @flow

import React from 'react';
import { Chart } from 'react-google-charts';

export default ({ logs }: Object) => {
  const data = {};
  logs.forEach(log => {
    data[log.data.type] = data[log.data.type] || {};
    data[log.data.type][log.data.key] =
      (data[log.data.type][log.data.key] || 0) + 1;
  });

  return (
    <div>
      {data.idea &&
        <Chart
          chartType="BarChart"
          data={[
            ['Name', 'Count'],
            ...Object.keys(data.idea).map(key => [key, data.idea[key]])
          ]}
          width="100%"
          height="300px"
          options={{
            title: 'number of suggested ideas per group',
            bar: { groupWidth: '95%' },
            legend: { position: 'none' }
          }}
        />}
      {data.vote &&
        <Chart
          chartType="BarChart"
          data={[
            ['Name', 'Count'],
            ...Object.keys(data.vote).map(key => [key, data.vote[key]])
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
