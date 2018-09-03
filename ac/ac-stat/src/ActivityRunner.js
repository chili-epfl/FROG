// @flow

import * as React from 'react';

import type { ActivityRunnerPropsT } from 'frog-utils';

import DataGraph from './Components/DataGraph';

const style = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

export default (props: ActivityRunnerPropsT) => (
  <div style={style}>
    <DataGraph {...props} />
    {props.activityData.config.doubleView && <DataGraph {...props} />}
  </div>
);
