// @flow

import React from 'react';
import { Chart } from 'react-google-charts';

export const ScatterChart = ({ data }: { data: Array<Array<number>> }) => (
  <Chart
    chartType="ScatterChart"
    data={[['x', 'y'], ...data]}
    width="100%"
    height="300px"
    options={{
      title: 'dimensions',
      bar: { groupWidth: '95%' },
      legend: { position: 'none' },
      vAxis: {
        title: 'y',
        minValue: -10,
        maxValue: 10,
        gridlines: { count: 11 }
      },
      hAxis: {
        title: 'x',
        minValue: -10,
        maxValue: 10,
        gridlines: { count: 11 }
      }
    }}
  />
);

export const CountChart = ({
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
}) =>
  data ? (
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
        hAxis: { title: hAxis, minValue: 10, gridlines: { count: 3 } }
      }}
    />
  ) : (
    <h2>Missing data</h2>
  );

  export const LineChart = ({ data }: { data: Array<Array<number>> }) => (
    <Chart
      chartType="LineChart"
      data={[['x', 'y'], ...data]}
      width="100%"
      height="300px"
      options={{
        title: 'Activity Progress',
        curveType: 'function',
        legend: { position: 'none' },
        vAxis: {
          title: 'Class Progress',
          minValue: 0,
          maxValue: 100
        },
        hAxis: {
          title: 'Time',
          minValue: 0
        }
      }}
    />
  );
