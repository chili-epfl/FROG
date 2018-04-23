// @flow

import React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

export default ({ activityData }: ActivityRunnerPropsT) => (
  <div>
    <h1>{activityData.config.title}</h1>
    <p>{activityData.config.info}</p>
  </div>
);
