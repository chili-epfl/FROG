// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import Graph from './Graph';

export default ({ activityData, data }: ActivityRunnerPropsT) => (
  <Graph
    data={Object.keys(data).map(x => ({ ...data[x], name: x }))}
    config={activityData.config}
  />
);
