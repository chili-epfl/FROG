// @flow

import * as React from 'react';
import Plotly from 'react-plotly.js';

// the actual component that the student sees
export default ({ logger, activityData, data, dataFn, userInfo }) => {
  const myData = [
    {
      x: [0, 1, 3, 6, 10],
      y: [12,23,34,45,47]
    }
  ]
  return (
  <div>
    {Plotly.newPlot(<div/>, myData)}
    {/* JSON.stringify(activityData) */}
  </div>
);}
