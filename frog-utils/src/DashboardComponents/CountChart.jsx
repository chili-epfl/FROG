// @flow

import React from 'react';
import { Chart } from 'react-google-charts';

export default (props: Object) => {
  console.log(props)
  return (props.data
    ? <Chart
    chartType="BarChart"
    data={[
      ['Name', 'Count'],
      ...Object.keys(props.data).map(k => [k, props.data[k]])
    ]}
    width="100%"
    height="300px"
    options={{
      title: 'number of something',
      bar: { groupWidth: '95%' },
      legend: { position: 'none' }
    }}
  />
: <h2>Missing data</h2>)
}
