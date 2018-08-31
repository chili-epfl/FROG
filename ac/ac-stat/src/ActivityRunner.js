// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import DataGraph from './Components/DataGraph';

export default (props: ActivityRunnerPropsT) => (
  <>
    <DataGraph {...props} />
    {props.activityData.config.doubleView && <DataGraph {...props} />}
  </>
);
