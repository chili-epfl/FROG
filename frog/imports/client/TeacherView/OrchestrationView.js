// @flow

import * as React from 'react';
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
  error: String
};

const OrchestrationViewRaw = (props: OrchestrationViewPropsT) => {
  const [currentActivity, setCurrentActivity] = React.useState('welcome');

  const activityToDash = props.activities?.find(a => a._id === currentActivity);

  let currentActivities, ready, toggle;

  if (props.session) {
    currentActivities = props.session.openActivities.map(x =>
      Activities.findOne(x)
    );
    ready = !currentActivities.some(x => x === undefined);
    toggle = id =>
      currentActivity === id
        ? setCurrentActivity(null)
        : setCurrentActivity(id);
  }

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {props.session ? (
        <OrchestrationContextProvider
          session={props.session}
          activities={props.activities}
          students={props.students}
        >
          {getUserType() === 'Anonymous' &&
          !window.location.search.includes('?u=') ? (
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
      ) : (
        <ErrorPage
          title="Error"
          message={props.error}
          history={props.history}
        />
      )}
    </>
  );
};

export const OrchestrationView = compose(
  withDragDropContext,
  withRouter
)(OrchestrationViewRaw);
