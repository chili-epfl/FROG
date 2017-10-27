// @flow

import React from 'react';
import { Chart } from 'react-google-charts';

export default ({
  title,
  vAxis,
  hAxis,
  categories,
  data
}: {
  title: string,
  vAxis: string,
  hAxis: string,
  categories: string[],
  data: number[]
}) => {
  console.log(data);
  return data ? (
    <Chart
      chartType="BarChart"
      data={[
        ['Category', 'Count'],
        ...data.map((d, i) => [categories[i] || i, d])
      ]}
      width="100%"
      height="300px"
      options={{
        title,
        bar: { groupWidth: '95%' },
        legend: { position: 'none' },
        vAxis: { title: vAxis },
        hAxis: { title: hAxis, minValue: 0, gridlines: { count: -1 } }
      }}
    />
  ) : (
    <h2>Missing data</h2>
  );
};
