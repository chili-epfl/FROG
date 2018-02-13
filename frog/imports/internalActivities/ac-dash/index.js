// @flow

import * as React from 'react';
import type { ActivityPackageT, ActivityRunnerT } from 'frog-utils';
import { Activities } from '/imports/api/activities';
import { Sessions } from '/imports/api/sessions';
import { Dashboard } from '/imports/ui/TeacherView/Dashboard';

export const meta = {
  name: 'Dashboard activity',
  shortDesc: 'Show a dashboard from a previous activity',
  description:
    'Show a dashboard from a previous activity. This is often useful for debriefing'
};

const ActivityRunner = (props: ActivityRunnerT) => {
  const { activityData: { config }, sessionId } = props;
  const activity = Activities.findOne(config.activity);
  const session = Sessions.find(sessionId);
  return <Dashboard activity={activity} session={session} />;
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
