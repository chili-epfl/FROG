// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import Graph from './Graph';

export default ({ activityData, data }: ActivityRunnerPropsT) => (
  <Graph
    data={Object.keys(data).map(trace => ({ ...data[trace], name: trace }))}
    config={activityData.config}
  />
);
