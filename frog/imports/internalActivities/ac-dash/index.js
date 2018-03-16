// @flow

import * as React from 'react';

import type { ActivityPackageT, ActivityRunnerT } from 'frog-utils';
import { DashboardSubscriptionWrapper } from '/imports/ui/TeacherView/Dashboard';

export const meta = {
  name: 'Dashboard activity',
  shortDesc: 'Show a dashboard from a previous activity',
  description:
    'Show a dashboard from a previous activity. This is often useful for debriefing'
};

const ActivityRunner = (props: ActivityRunnerT) => {
  const activityId = props.activityData.config.activity;
  const sessionId = props.sessionId;

  return (
    <DashboardSubscriptionWrapper
      activityId={activityId}
      sessionId={sessionId}
    />
  );
};

export default ({
  id: 'ac-dash',
  type: 'react-component',
  ActivityRunner,
  config: {
    type: 'object',
    required: ['activity'],
    properties: {
      activity: {
        type: 'activity',
        title: 'Applies to which activity'
      }
    }
  },
  meta
}: ActivityPackageT);
