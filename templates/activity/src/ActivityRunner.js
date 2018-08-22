// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';

// the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) => (
  <div>{JSON.stringify(activityData)}</div>
);

export default (ActivityRunner: ActivityRunnerT);
