// @flow

import React from 'react';
import { Chart } from 'react-google-charts';

export default ({
  title,
  categories,
  data
}: {
  title: string,
  categories: string[],
  data: number[]
}) =>
  data
    ? <Chart
        chartType="BarChart"
        data={[
          ['Category', 'Count'],
          ...data.map((d, i) => [categories[i] || d, d])
        ]}
        width="100%"
        height="300px"
        options={{
          title: title || 'Number of something',
          bar: { groupWidth: '95%' },
          legend: { position: 'none' }
        }}
      />
    : <h2>Missing data</h2>;
