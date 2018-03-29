// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withState } from 'recompose';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Button from 'material-ui/Button';

import { Activities } from '../../api/activities';
import { activityTypesObj } from '../../activityTypes';
import { DashboardReactiveWrapper } from './Dashboard';
import { ErrorBoundary } from '../App/ErrorBoundary';

const drawerWidth = 180;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  button: {
    floar: 'left'
  },
  appFrame: {
    height: 600,
    overflow: 'hidden',
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: theme.palette.background.default
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    width: `calc(100% - ${drawerWidth}px)`
  }
});

const ActivityChoiceButton = withStyles(styles)(
  ({ ac, setActivityId, classes, selected }) => (
    <Button
      onClick={() => setActivityId(ac._id)}
      className={classes.button}
      color={selected ? 'primary' : 'default'}
    >
      {ac.title + (ac.open ? ' (open)' : '')}
    </Button>
  )
);

const ActivityChoiceMenu = withStyles(styles)(
  ({ classes, activities, setActivityId, activityId }) => (
    <Drawer
      variant="permanent"
      classes={{ paper: classes.drawerPaper }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <List>
        {activities.map(ac => (
          <ActivityChoiceButton
            key={ac._id}
            ac={ac}
            setActivityId={setActivityId}
            selected={ac._id === activityId}
          />
        ))}
      </List>
    </Drawer>
  )
);

const DashboardNav = withState('activityId', 'setActivityId', null)(props => {
  const { activityId, setActivityId, session, activities, classes } = props;
  const { openActivities } = session;
  const acWithDash = activities
    .filter(ac => {
      const dash = activityTypesObj[ac.activityType].dashboard;
      return !!dash;
    })
    .map(ac => ({ ...ac, open: openActivities.includes(ac._id) }));
  const openAcWithDashIds = acWithDash
    .map(x => x._id)
    .filter(aid => openActivities && openActivities.includes(aid));
  const aId = activityId || openAcWithDashIds.find(() => true);
  const activityToDash = activities.find(a => a._id === aId);

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <ActivityChoiceMenu
          activities={acWithDash}
          setActivityId={setActivityId}
          activityId={aId}
        />
        <main className={classes.content}>
          {activityToDash && (
            <ErrorBoundary msg="Dashboard crashed, try reloading">
              <DashboardReactiveWrapper
                sessionId={session._id}
                activity={activityToDash}
              />
            </ErrorBoundary>
          )}
        </main>
      </div>
    </div>
  );
});

export default withTracker(({ session }) => ({
  activities: Activities.find({
    graphId: session.graphId,
    actualStartingTime: { $exists: true }
  }).fetch()
}))(withStyles(styles)(DashboardNav));
