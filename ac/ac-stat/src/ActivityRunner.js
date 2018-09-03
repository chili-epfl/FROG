// @flow

import * as React from 'react';
import { type ActivityRunnerPropsT, values } from 'frog-utils';

import DataGraph from './Components/DataGraph';

const style = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

export default (props: ActivityRunnerPropsT) => {
  
  const { originalData, ...datasets } = props.data;
  const axis = [
    Math.min(
      ...values(datasets).map(ds =>
        Math.min(...ds.values.map(entry => entry[0]))
      )
    ),
    Math.max(
      ...values(datasets).map(ds =>
        Math.max(...ds.values.map(entry => entry[0]))
      )
    )
  ];
  return (
  <div style={style}>
    <DataGraph {...props}  axis={axis} />
    {props.activityData.config.doubleView && <DataGraph {...props}  axis={axis} />}
  </div>
);
