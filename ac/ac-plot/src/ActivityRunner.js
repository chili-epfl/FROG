// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import DataForm from './DataForm';
import Graph from './Graph';

export default ({ activityData, data, dataFn }: ActivityRunnerPropsT) => (
  <div style={{ display: 'flex' }}>
    <DataForm {...{ data, dataFn }} />
    <div
      style={{ width: '1px', height: 'inherit', backgroundColor: '#000000' }}
    />
    <Graph data={data} config={activityData.config} />
  </div>
);
