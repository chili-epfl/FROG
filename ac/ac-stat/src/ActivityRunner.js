// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import DataGraph from './DataGraph';

export default (props: ActivityRunnerPropsT) => (
  <>
    <DataGraph {...props} />
    {props.activityData.config.doubleView && (
      <>
        <div
          style={{ width: '100%', height: '1px', backgroundColor: '#000' }}
        />
        <DataGraph {...props} />
      </>
    )}
  </>
);
