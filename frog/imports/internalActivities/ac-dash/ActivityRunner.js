// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import { DashboardReactiveWrapper } from '/imports/ui/Dashboard';

const ActivityRunner = (props: ActivityRunnerPropsT) => {
  const {
    sessionId,
    activityData: { config }
  } = props;
  const activityId = config.component.activity;
  const names = config.component.dashboards;
  return (
    <DashboardReactiveWrapper
      activityId={activityId}
      sessionId={sessionId}
      names={names}
    />
  );
};

export default ActivityRunner;
