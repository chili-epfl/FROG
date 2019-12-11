// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { sortBy } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { ActivitySplitWindow } from '/imports/ui/ActivitySplitWindow';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import { Accounts } from 'meteor/accounts-base';
import { withRouter } from 'react-router';
import { Activities } from '/imports/api/activities';
import { logLogin } from '/imports/api/logs';
import { Sessions } from '/imports/api/sessions';
import Runner from './Runner';
import Countdown from './Countdown';
import { getUsername } from '/imports/api/users';

let loggedIn = false;

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    height: '100%',
    width: '100%',
    overflow: 'auto'
  },
  appbar: {
    borderBottom: '1px solid #EEE',
    boxShadow: 'none'
  },
  toolbar: {
    minHeight: 48,
    height: 48,
    background: '#FFF'
  },
  userTitle: {
    flex: 1,
    fontSize: '1.5em',
    fontWeight: '500',
    color: '#000'
  },
  mainContent: {
    width: '100%',
    marginTop: 48
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    fontWeight: '500',
    textTransform: 'capitalize',
    fontSize: '1.1em',
    color: '#444'
  },
  message: {
    padding: theme.spacing(3)
  }
});

export const ActivityContainer = ({
  activities,
  sessionId,
  paused
}: Object) => {
  if (activities.length === 0) {
    return 'No activity';
  }
  return (
    <ActivitySplitWindow>
      {sortBy(activities, 'title').map(activity => {
        return (
          <Runner
            activity={activities.find(x => x._id === activity._id)}
            sessionId={sessionId}
            paused={paused}
            key={activity._id}
          />
        );
      })}
    </ActivitySplitWindow>
  );
};

const StudentView = withRouter(({ activities, session, classes, history }) => (
  <div className={classes.root}>
    <div className={classes.navbar}>
      <AppBar className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          {Meteor.user() && (
            <Typography type="h6" color="inherit" className={classes.userTitle}>
              {getUsername()}
            </Typography>
          )}
          {Meteor.userId() === session.ownerId && (
            <Button
              className={classes.button}
              color="inherit"
              onClick={() => {}}
              href={`/t/${session.slug}`}
              target="_blank"
            >
              Orchestration View
            </Button>
          )}
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => {
              history.push('/');
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
            return (
              <Typography variant="h4" className={classes.message}>
                Waiting for teacher to start the session
              </Typography>
            );
          }
          if (session.state === 'STARTED') {
            return (
              <Typography variant="h4" className={classes.message}>
                No activity right now
              </Typography>
            );
          }
          if (session.state === 'FINISHED') {
            return (
              <Typography variant="h4" className={classes.message}>
                Session finished
              </Typography>
            );
          }
        }
        if (session.state === 'PAUSED') {
          return (
            <Typography variant="h4" className={classes.message}>
              Paused
            </Typography>
          );
        }
        return (
          <ActivityContainer activities={activities} sessionId={session._id} />
        );
      })()}
    </div>
  </div>
));

const StyledStudentView = withStyles(styles)(StudentView);

class SessionBody extends React.Component<
  {
    activities: Array<Object>,
    session: Object
  },
  void
> {
  componentDidMount() {
    if (!loggedIn) {
      loggedIn = true;
      logLogin(this.props.session._id);
    }
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

SessionBody.displayName = 'SessionBody';

export default withTracker(() => ({
  session: Sessions.findOne(),
  activities: Activities.find().fetch()
}))(SessionBody);
