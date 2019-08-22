import * as React from 'react';

import { DashboardReactiveWrapper } from '/imports/client/Dashboard';
import { OrchestrationContext } from '../context';
import { Activities } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';

export const DashboardContainer = () => {
  const session = React.useContext(OrchestrationContext);

  const currentActiveSteps = session.steps.filter(x => x.status === 'active');
  if (currentActiveSteps.length === 0) {
    return null;
  }
  const currentActiveActivity = Activities.findOne(currentActiveSteps[0]._id);
  const aT = activityTypesObj[(currentActiveActivity?.activityType)];
  if (
    !currentActiveActivity ||
    !aT ||
    (!aT.dashboards && !aT.meta?.supportsLearningItems)
  ) {
    return null;
  }

  return (
    <DashboardReactiveWrapper
      sessionId={session._id}
      activity={currentActiveActivity}
    />
  );
};

export default DashboardContainer;
