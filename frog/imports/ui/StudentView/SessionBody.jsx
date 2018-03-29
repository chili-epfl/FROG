// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { sortBy } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Mosaic } from 'react-mosaic-component';
import { Accounts } from 'meteor/accounts-base';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { Accounts } from 'meteor/accounts-base';
import { getInitialState } from 'frog-utils';

import { Activities } from '../../api/activities';
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
    marginTop: 48,
    flex: 'auto',
    display: 'flex',
    alignItems: 'center'
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
      <Mosaic
        renderTile={(activityId, path) => (
          <Runner
            activity={activities.find(x => x._id === activityId)}
            path={path}
            sessionId={sessionId}
          />
        )}
        initialValue={getInitialState(
          sortBy(activities.map(x => x._id), 'activityType')
        )}
      />
    );
  }
};

const StudentView = ({ activities, session, token, classes }) => {
  if (!activities || activities.length === 0) {
    return <h1>No Activity right now</h1>;
  }
  if (session.state === 'PAUSED') {
    return <h1>Paused</h1>;
  }
  return (
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
            {Meteor.user() &&
              Meteor.user().username === 'teacher' && (
                <Button
                  className={classes.button}
                  color="inherit"
                  onClick={() => {}}
                  href={`/?login=teacher&token=${(token && token.value) || ''}`}
                  target="_blank"
                >
                  Dashboard
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
        <ActivityContainer activities={activities} sessionId={session._id} />
      </div>
    </div>
  );
};

const SessionBody = ({
  activities,
  session,
  token,
  classes
}: {
  activities: Array<Object>,
  session: Object,
  classes: Object,
  token?: { value: string }
}) => (
  <div id="student" className={classes.root}>
    {session.countdownStartTime && <Countdown session={session} />}
    <StudentView
      session={session}
      activities={activities}
      classes={classes}
      token={token}
    />
  </div>
);

SessionBody.displayName = 'SessionBody';

export default withTracker(() => ({
  session: Sessions.findOne(),
  activities: Activities.find().fetch()
}))(withStyles(styles)(SessionBody));
