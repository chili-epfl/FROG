import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

const ActivityRunner = ({ activityData }: ActivityRunnerPropsT) => (
  <iframe
    title="IFrame"
    src={activityData.config.url}
    style={{ width: '100%', height: '100%', overflow: 'auto' }}
  />
);

export default ActivityRunner;
