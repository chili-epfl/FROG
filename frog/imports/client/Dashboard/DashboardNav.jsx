// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withState } from 'recompose';
import { orderBy } from 'lodash';

import { withStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { Activities } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';
import { DashboardReactiveWrapper } from './index';
import LIDashboard from './LIDashboard';
import { teacherLogger } from '/imports/api/logs';

const drawerWidth = 220;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  appFrame: {
    height: '80vh',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    height: '80vh',
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
ActivityChoiceMenu.displayName = 'ActivityChoiceMenu';

const DashboardNav = withState('activityId', 'setActivityId', null)(props => {
  const { activityId, setActivityId, session, activities, classes } = props;
  const { openActivities } = session;
  const acWithDash = activities
    .filter(ac => {
      const dash = activityTypesObj[ac.activityType].dashboards;
      return (
        !!dash || activityTypesObj[ac.activityType].meta.supportsLearningItems
      );
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
          activities={[
            { title: 'Blank screen', _id: 'blank' },
            ...orderBy(acWithDash, 'startTime')
          ]}
          setActivityId={id => {
            teacherLogger(session._id, 'teacher.switchDashboardActivity', id);
            setActivityId(id);
          }}
          activityId={aId}
        />
        <main className={classes.content}>
          {activityId === 'LI' && <LIDashboard sessionId={session._id} />}
          {activityToDash &&
            (activityToDash === 'blank' ? null : (
              <DashboardReactiveWrapper
                sessionId={session._id}
                activity={activityToDash}
              />
            ))}
        </main>
      </div>
    </div>
  );
});
DashboardNav.displayName = 'DashboardNav';

export default withTracker(({ session }) => ({
  activities: Activities.find({
    graphId: session.graphId,
    actualStartingTime: { $exists: true }
  }).fetch()
}))(withStyles(styles)(DashboardNav));
