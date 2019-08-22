// @flow

import * as React from 'react';
import { OrchestrationContextProvider } from './context';

import OrchestrationLayout from './components/OrchestrationLayout';

import { SessionControlContainer } from './containers/SessionControlContainer';
import { StepsContainer } from './containers/StepsContainer';
import { SlugContainer } from './containers/SlugContainer';
import GraphView from './GraphView';
import { DashboardReactiveWrapper } from '../Dashboard';

type OrchestrationViewPropsT = {
  session: Object,
  activities: Object
};

export const OrchestrationView = (props: OrchestrationViewPropsT) => {
  const [currentActivity, setCurrentActivity] = React.useState('welcome');

  const activityToDash = props.activities.find(a => a._id === currentActivity);

  return (
    <OrchestrationContextProvider
      session={props.session}
      activities={props.activities}
    >
      <OrchestrationLayout
        orchestrationControl={<SessionControlContainer />}
        sessionSteps={<StepsContainer onClick={setCurrentActivity} />}
        slugButton={<SlugContainer />}
        graphView={<GraphView session={props.session} />}
      >
        {currentActivity !== 'welcome' && activityToDash ? (
          <DashboardReactiveWrapper
            sessionId={props.session._id}
            activity={activityToDash}
          />
        ) : (
          <div />
        )}
      </OrchestrationLayout>
    </OrchestrationContextProvider>
  );
};
