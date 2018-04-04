// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withState } from 'recompose';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';

import { Activities } from '../../api/activities';
import { activityTypesObj } from '../../activityTypes';
import { DashboardReactiveWrapper } from './index';
import LIDashboard from './LIDashboard';

const drawerWidth = 220;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  appFrame: {
    height: '100%',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    height: '100%',
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

const ActivityChoiceLI = ({ ac, setActivityId, selected }) => {
  const txt = ac.title + (ac.open ? ' (open)' : '');
  return (
    <ListItem button onClick={() => setActivityId(ac._id)}>
      <ListItemText primary={selected && txt} secondary={!selected && txt} />
    </ListItem>
  );
};

const ActivityChoiceMenu = withStyles(styles)(
  ({ classes, activities, setActivityId, activityId }) => (
    <Drawer
      variant="permanent"
      classes={{ paper: classes.drawerPaper }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <List>
        <ListItem button onClick={() => setActivityId('LI')}>
          <ListItemText
            primary={activityId === 'LI' && 'Learning Items Dashboard'}
            secondary={activityId !== 'LI' && 'Learning Items Dashboard'}
          />
        </ListItem>
        {activities.map(ac => (
          <ActivityChoiceLI
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
          {activityId === 'LI' && <LIDashboard sessionId={session._id} />}
          {activityToDash && (
            <DashboardReactiveWrapper
              sessionId={session._id}
              activity={activityToDash}
            />
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
