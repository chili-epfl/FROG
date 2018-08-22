// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import Graph from './Graph';
import DataForm from './DataForm';

export default ({ activityData, data, dataFn }: ActivityRunnerPropsT) => (
  <div style={{ display: 'flex' }}>
    <DataForm {...{ data, dataFn }} />
    <div
      style={{ width: '1px', height: 'inherit', backgroundColor: '#000000' }}
    />
    <Graph
      data={Object.keys(data).map(x => ({ ...data[x], name: x }))}
      config={activityData.config}
    />
  </div>
);
