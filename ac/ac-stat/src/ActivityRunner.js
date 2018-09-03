// @flow

import * as React from 'react';
import { type ActivityRunnerPropsT, values } from 'frog-utils';

import DataGraph from './DataGraph';

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
    <>
      <DataGraph {...props} axis={axis} />
      {props.activityData.config.doubleView && (
        <>
          <div
            style={{ width: '100%', height: '1px', backgroundColor: '#000' }}
          />
          <DataGraph {...props} axis={axis} />
        </>
      )}
    </>
  );
};
