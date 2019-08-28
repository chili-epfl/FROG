// @flow

import * as React from 'react';
import { OrchestrationContextProvider } from './context';

import OrchestrationLayout from './components/OrchestrationLayout';

import { withDragDropContext } from '/imports/frog-utils';
import { compose } from 'recompose';
import { Activities } from '/imports/api/activities';
import { SessionControlContainer } from './containers/SessionControlContainer';
import { StepsContainer } from './containers/StepsContainer';
import { TopBarContainer } from './containers/TopBarContainer';
import GraphView from './GraphView';
import { DashboardReactiveWrapper } from '../Dashboard';
import { StudentContainer } from './containers/StudentContainer';
import { PreviewView } from './components/PreviewView';
import { WelcomeView, ConcludedView } from './components/WelcomeView';
import { PreviewContainer } from './containers/PreviewContainer';

type OrchestrationViewPropsT = {
  session: Object,
  activities: Object,
  students: Object,
};

const OrchestrationViewRaw = (props: OrchestrationViewPropsT) => {
  const [currentActivity, setCurrentActivity] = React.useState('welcome');

  const activityToDash = props.activities?.find(a => a._id === currentActivity);
  if (!props.session) {
    return null;
  }
  const currentActivities = props.session.openActivities.map(x =>
    Activities.findOne(x)
  );
  const ready = !currentActivities.some(x => x === undefined);
  const toggle = id =>
    currentActivity === id ? setCurrentActivity(null) : setCurrentActivity(id);

  return (
    <OrchestrationContextProvider
      session={props.session}
      activities={props.activities}
      students={props.students}
    >
      <OrchestrationLayout
        orchestrationControl={<SessionControlContainer />}
        sessionSteps={
          <StepsContainer activeId={currentActivity} onClick={toggle} />
        }
        studentView={<StudentContainer onClick={() => {}} />}
        topBar={<TopBarContainer />}
        graphView={
          props.session?.singleActivity ? null : (
            <GraphView session={props.session} />
          )
        }
      >
        {ready ? (
          activityToDash ? (
            <DashboardReactiveWrapper
              sessionId={props.session._id}
              activity={activityToDash}
            />
          ) : props.session.timeInGraph === -1 ? (
            <WelcomeView slug={props.session.slug} />
          ) : props.session.openActivities?.length === 0 ? (
            <ConcludedView />
          ) : (
            <PreviewContainer currentActivity={currentActivities} />
          )
        ) : (
          <WelcomeView slug={props.session.slug} />
        )}
      </OrchestrationLayout>
    </OrchestrationContextProvider>
  );
};

export const OrchestrationView = compose(withDragDropContext)(
  OrchestrationViewRaw
);
