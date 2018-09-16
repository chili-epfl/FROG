// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { sortBy } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { MosaicWithoutDragDropContext } from 'react-mosaic-component';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Accounts } from 'meteor/accounts-base';
import { getInitialState, withDragDropContext } from 'frog-utils';
import { compose, toClass } from 'recompose';

import { Activities } from '../../api/activities';
import { logLogin } from '../../api/logs';
import { Sessions } from '../../api/sessions';
import Runner from './Runner';
import Countdown from './Countdown';

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    height: '100%',
    width: '100%'
  },
  toolbar: {
    minHeight: 48,
    height: 48
  },
  flex: {
    flex: 1
  },
  mainContent: {
    width: '100%',
    marginTop: 48
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};

const ActivityContainer = ({ activities, sessionId }) => {
  if (activities.length === 1) {
    return <Runner activity={activities[0]} sessionId={sessionId} single />;
  } else {
    return (
      <MosaicWithoutDragDropContext
        renderTile={(activityId, path) => (
          <Runner
            activity={activities.find(x => x._id === activityId)}
            path={path}
            sessionId={sessionId}
          />
        )}
        initialValue={getInitialState(
          sortBy(activities, 'title').map(x => x._id)
        )}
      />
    );
  }
};

const StudentView = ({ activities, session, classes }) => (
  <div className={classes.root}>
    <div className={classes.navbar}>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          {Meteor.user() && (
            <Typography
              type="subheading"
              color="inherit"
              className={classes.flex}
            >
              {Meteor.user().username}
            </Typography>
          )}
          {Meteor.userId() === session.ownerId && (
            <Button
              className={classes.button}
              color="inherit"
              onClick={() => {}}
              href="/teacher/orchestration"
              target="_blank"
            >
              Orchestration View
            </Button>
          )}
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => {
              Meteor.logout();
              Accounts._unstoreLoginToken();
              window.notReady();
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
    <div className={classes.mainContent}>
      {(() => {
        if (!activities || activities.length === 0) {
          if (session.state === 'READY' || session.state === 'CREATED') {
            return <h1>Waiting for teacher to start the session</h1>;
          }
          if (session.state === 'STARTED') {
            return <h1>No activity right now</h1>;
          }
          if (session.state === 'FINISHED') {
            return <h1>Session finished</h1>;
          }
        }
        if (session.state === 'PAUSED') {
          return <h1>Paused</h1>;
        }
        return (
          <ActivityContainer activities={activities} sessionId={session._id} />
        );
      })()}
    </div>
  </div>
);

const StyledStudentView = withStyles(styles)(StudentView);

class SessionBodyController extends React.Component<
  {
    activities: Array<Object>,
    session: Object
  },
  void
> {
  componentDidMount() {
    logLogin(this.props.session._id);
  }

  render() {
    const { activities, session } = this.props;
    if (!session) {
      return <CircularProgress />;
    }
    return (
      <React.Fragment>
        {session.countdownStartTime && <Countdown session={session} />}
        <StyledStudentView session={session} activities={activities} />
      </React.Fragment>
    );
  }
}

const SessionBody = compose(
  withDragDropContext,
  toClass
)(SessionBodyController);

SessionBody.displayName = 'SessionBody';

export default withTracker(() => ({
  session: Sessions.findOne(),
  activities: Activities.find().fetch()
}))(SessionBody);
