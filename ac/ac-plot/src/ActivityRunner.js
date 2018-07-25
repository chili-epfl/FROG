// @flow

import * as React from 'react';

// the actual component that the student sees
export default ({ logger, activityData, data, dataFn, userInfo }) => (
  <div>{JSON.stringify(activityData)}</div>
);
