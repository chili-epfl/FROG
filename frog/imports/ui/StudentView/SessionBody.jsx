// @flow

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { sortBy } from 'lodash';
// UI
import { Mosaic } from 'react-mosaic-component';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import { Activities } from '../../api/activities';
import { Sessions } from '../../api/sessions';
import Runner from './Runner';

const getInitialState = (activities, d = 1) => {
  const n = Math.floor(activities.length / 2);
  return n === 0
    ? activities[0]._id
    : {
        direction: d > 0 ? 'row' : 'column',
        first: getInitialState(activities.slice(0, n), -d),
        second: getInitialState(activities.slice(n, activities.length), -d)
      };
};

const SessionBody = ({
  activities,
  session
}: {
  activities: Object[],
  session: Object
}) => {
  const styles = {
    uber: {
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto'
    },
    appBar: {
      width: '100%'
    },

    text: {
      flex: 1,
      fontSize: '1.5rem'
    },
    mainContent: {
      width: '100%',
      height: '100%',
      margin: '10',
      flex: 'auto',
      background: 'red',
      display: 'flex',
      alignItems: 'center'
    },
    navbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  };

  if (!activities || activities.length === 0) {
    return <h1>No Activity</h1>;
  }
  if (session.state === 'PAUSED') {
    return <h1>Paused</h1>;
  }
  return (
    <div style={styles.uber}>
      <div style={styles.navbar}>
        <AppBar position="static" style={styles.appBar}>
          <Toolbar>
            <IconButton color="contrast" aria-label="Menu">
              <Typography type="title" color="inherit" style={styles.text}>
                <MenuIcon />
              </Typography>
            </IconButton>
            <Typography type="title" color="inherit" style={styles.text}>
              COMMON KNOWLEDGE
            </Typography>
            <Button color="contrast">
              <Typography type="button" color="inherit" style={styles.text}>
                ole
              </Typography>
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <div style={styles.mainContent}>
        <ActivityContainer activities={activities} sessionId={session._id} />
      </div>
    </div>
  );
};

const ActivityContainer = ({ activities, sessionId }) => {
  if (activities.length === 1) {
    return <Runner activity={activities[0]} sessionId={sessionId} single />;
  } else {
    return (
      <Mosaic
        renderTile={(activityid, path) => (
          <Runner
            activity={activities.find(x => x._id === activityid)}
            path={path}
            sessionId={sessionId}
          />
        )}
        initialValue={getInitialState(sortBy(activities, 'activityType'))}
      />
    );
  }
};

SessionBody.displayName = 'SessionBody';

export default createContainer(
  () => ({
    session: Sessions.findOne(),
    activities: Activities.find().fetch()
  }),
  SessionBody
);
