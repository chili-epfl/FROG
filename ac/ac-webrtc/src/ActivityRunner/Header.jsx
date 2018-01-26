// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';

export default ({ activityData }: ActivityRunnerT) => (
  <div>
    <h1>{activityData.config.title}</h1>
    <p>{activityData.config.info}</p>
  </div>
);
