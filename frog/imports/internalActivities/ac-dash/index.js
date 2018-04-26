// @flow

import * as React from 'react';

import type { ActivityPackageT, ActivityRunnerPropsT } from 'frog-utils';
import { DashboardSubscriptionWrapper } from '/imports/ui/Dashboard';
import ConfigComponent from './config.js';

export const meta = {
  name: 'Dashboard activity',
  shortDesc: 'Show a dashboard from a previous activity',
  description:
    'Show a dashboard from a previous activity. This is often useful for debriefing'
};

const ActivityRunner = (props: ActivityRunnerPropsT) => {
  const {
    sessionId,
    activityData: { config }
  } = props;
  const activityId = config.component.activity;
  const names = config.component.dashboards;
  return (
    <DashboardSubscriptionWrapper
      activityId={activityId}
      sessionId={sessionId}
      names={names}
    />
  );
};

export default ({
  id: 'ac-dash',
  type: 'react-component',
  ActivityRunner,
  config: {},
  ConfigComponent,
  meta
}: ActivityPackageT);
