// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { compose } from 'recompose';

import { withDragDropContext } from '/imports/frog-utils';
import { Activities } from '/imports/api/activities';
import { withRouter } from 'react-router';

import { getUserType } from '/imports/api/users';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import Dialog from '@material-ui/core/Dialog';

import { OrchestrationContextProvider } from './context';
import OrchestrationLayout from './components/OrchestrationLayout';
import { WelcomeView, ConcludedView } from './components/WelcomeView';
import { SessionControlContainer } from './containers/SessionControlContainer';
import { StepsContainer } from './containers/StepsContainer';
import { TopBarContainer } from './containers/TopBarContainer';
import { StudentContainer } from './containers/StudentContainer';
import { PreviewContainer } from './containers/PreviewContainer';
import GraphView from './GraphView';

import { DashboardReactiveWrapper } from '../Dashboard';
import ErrorPage from '/imports/ui/ErrorPage';

type OrchestrationViewPropsT = {
  session: Object,
  activities: Object,
  students: Object,
  error: Object,
  history: Object
};

const OrchestrationViewRaw = (props: OrchestrationViewPropsT) => {
  const [currentActivity, setCurrentActivity] = React.useState('welcome');
  const [open, setOpen] = React.useState(true);

  const activityToDash = props.activities
    ? props.activities.find(a => a._id === currentActivity)
    : null;

  if (!props.session) {
    return (
      <ErrorPage
        title={props.error.title}
        message={props.error.message}
        history={props.history}
      />
    );
  }
  const currentActivities = props.session.openActivities.map(x =>
    Activities.findOne(x)
  );
  const ready = !currentActivities.some(x => x === undefined);
  const toggle = id =>
    currentActivity === id ? setCurrentActivity(null) : setCurrentActivity(id);

  const handleClose = () => setOpen(false);

  const showAccountModal =
    getUserType() === 'Anonymous' && !window.location.search.includes('?u=');

  return (
    <OrchestrationContextProvider
      session={props.session}
      activities={props.activities}
      students={props.students}
    >
      {showAccountModal ? (
        <Dialog open={open} onClose={handleClose}>
          <AccountModal
            formToDisplay="signup"
            closeModal={() => {
              props.history.push(
                `/t/${props.session.slug}?u=${Meteor.userId()}`
              );
              handleClose();
            }}
            variant="guest"
          />
        </Dialog>
      ) : null}
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
            <PreviewContainer
              currentActivity={currentActivities}
              paused={props.session.state === 'PAUSED'}
            />
          )
        ) : (
          <WelcomeView slug={props.session.slug} />
        )}
      </OrchestrationLayout>
    </OrchestrationContextProvider>
  );
};

export const OrchestrationView = compose(
  withDragDropContext,
  withRouter
)(OrchestrationViewRaw);
