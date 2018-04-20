// @flow

import * as React from 'react';

import type { ActivityPackageT, ActivityRunnerT } from 'frog-utils';
import { DashboardSubscriptionWrapper } from '/imports/ui/Dashboard';

export const meta = {
  name: 'Dashboard activity',
  shortDesc: 'Show a dashboard from a previous activity',
  description:
    'Show a dashboard from a previous activity. This is often useful for debriefing'
};

const ActivityRunner = (props: ActivityRunnerT) => {
  const {
    sessionId,
    activityData: { config }
  } = props;
  const activityId = config.activityId;
  const names = config.names === 'all' ? null : config.names.split(',');
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
  config: {
    type: 'object',
    required: ['activityId'],
    properties: {
      activityId: {
        type: 'activity',
        title: 'Applies to which activity'
      },
      names: {
        type: 'string',
        title: 'Choose which dashboard to show (comma separated names)',
        default: 'all'
      }
    }
  },
  meta
}: ActivityPackageT);
