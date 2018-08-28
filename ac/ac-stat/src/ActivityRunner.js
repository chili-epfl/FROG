// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import DataGraph from './DataGraph';

export default (props: ActivityRunnerPropsT) => (
  <>
    <DataGraph {...props} />
    <DataGraph {...props} />
  </>
);
