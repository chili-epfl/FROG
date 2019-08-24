// @flow

import * as React from 'react';
import { OrchestrationContextProvider } from './context';

import OrchestrationLayout from './components/OrchestrationLayout';

import { SessionControlContainer } from './containers/SessionControlContainer';
import { StepsContainer } from './containers/StepsContainer';
import { TopBarContainer } from './containers/TopBarContainer';
import GraphView from './GraphView';
import { DashboardReactiveWrapper } from '../Dashboard';
import { StudentContainer } from './containers/StudentContainer';
import { WelcomeView } from './components/WelcomeView';

type OrchestrationViewPropsT = {
  session: Object,
  activities: Object,
  students: Object,
  token: Object
};

export const OrchestrationView = (props: OrchestrationViewPropsT) => {
  const [currentActivity, setCurrentActivity] = React.useState('welcome');

  const activityToDash = props.activities.find(a => a._id === currentActivity);

  return (
    <OrchestrationContextProvider
      session={props.session}
      activities={props.activities}
      students={props.students}
      token={props.token}
    >
      <OrchestrationLayout
        orchestrationControl={<SessionControlContainer />}
        sessionSteps={
          <StepsContainer
            activeId={currentActivity}
            onClick={setCurrentActivity}
          />
        }
        studentView={<StudentContainer onClick={() => {}} />}
        topBar={<TopBarContainer />}
        graphView={<GraphView session={props.session} />}
      >
        {currentActivity !== 'welcome' && activityToDash ? (
          <DashboardReactiveWrapper
            sessionId={props.session._id}
            activity={activityToDash}
          />
        ) : (
          <WelcomeView slug={props.session.slug} />
        )}
      </OrchestrationLayout>
    </OrchestrationContextProvider>
  );
};
