// @flow

import * as React from 'react';
import { withState } from 'recompose';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

import { activityTypesObj } from '../../activityTypes';
import { DashboardComp } from './Dashboard';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

const DashMultiWrapper = withState('which', 'setWhich', 0)((props) => {
  const { which, setWhich, activity, docs, names, classes } = props;
  const aT = activityTypesObj[activity.activityType];
  const dashNames = names || Object.keys(aT.dashboard);
  const [doc] = (docs && docs[which]) || [];
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={which}
          onChange={(_, w) => setWhich(w)}
          indicatorColor="primary"
          textColor="primary"
          scrollable
          scrollButtons="auto"
        >
          {dashNames.map(name => <Tab key={name} label={name} />)}
        </Tabs>
      </AppBar>
      <DashboardComp {...props} name={dashNames[which]} doc={doc} />
    </div>
  );
})

export default withStyles(styles)(DashMultiWrapper)
