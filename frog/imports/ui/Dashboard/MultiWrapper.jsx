// @flow

import * as React from 'react';
import { withState } from 'recompose';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

import { activityTypesObj } from '../../activityTypes';
import { DashboardComp } from './index';
import { ErrorBoundary } from '../App/ErrorBoundary';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
});

const MultiWrapper = withState('which', 'setWhich', 0)(props => {
  const { which, setWhich, activity, docs, names, classes } = props;
  const aT = activityTypesObj[activity.activityType];
  const dashNames = names || Object.keys(aT.dashboard);
  const w = which > dashNames.length ? 0 : which;
  const [doc] = (docs && docs[dashNames[w]]) || [];
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={w}
          onChange={(_, x) => setWhich(x)}
          indicatorColor="primary"
          textColor="primary"
          scrollable
          scrollButtons="auto"
        >
          {dashNames.map(name => <Tab key={name} label={name} />)}
        </Tabs>
      </AppBar>
      <ErrorBoundary msg="Dashboard crashed, try reloading">
        <DashboardComp {...props} name={dashNames[w]} doc={doc} />
      </ErrorBoundary>
    </div>
  );
});

export default withStyles(styles)(MultiWrapper);
