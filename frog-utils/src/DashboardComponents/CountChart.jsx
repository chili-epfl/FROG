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

  export const LineChart = ({
    title,
    vAxis,
    hAxis,
    hLen,
    rows
  }: {
    title: string,
    vAxis: string,
    hAxis: string,
    hLen: number,
    rows: Array<Array<number>>
  }) => (
    <Chart
      chartType="LineChart"
      rows= {rows}
      columns={[
            {'type': 'number', 'label': 'Time'},
            {'type': 'number', 'label': 'Progress'},
            {'type': 'number', 'label': 'Max', 'role': 'interval'},
            {'type': 'number', 'label': 'Min', 'role': 'interval'}
        ]}
      width="100%"
      height="300px"
      options={{
        title,
        legend: { position: 'none' },
        pointSize: 5,
        vAxis: {
          title: vAxis,
          minValue: 0,
          maxValue: 100,
          viewWindow: {max:100},
          gridlines: {color: 'transparent'}
        },
        hAxis: {
          title: hAxis,
          minValue: 0,
          maxValue: hLen,
          gridlines: {color: 'transparent'}
        }
      }}
    />
  );
