// @flow

import * as React from 'react';
import { withState, compose } from 'recompose';
import { type ActivityDBT } from 'frog-utils';

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

export const DashboardSelector = compose(
  withStyles(styles),
  withState('which', 'setWhich', 0)
)(
  ({
    which,
    setWhich,
    classes,
    dashNames,
    render,
    onChange,
    selected
  }: {
    which: number,
    setWhich: Function,
    classes: any,
    dashNames: string[],
    render: Function,
    onChange?: Function,
    selected: string
  }) => (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={selected !== undefined ? selected : which}
          onChange={(_, x) => {
            if (onChange) {
              onChange(x);
            }
            setWhich(x);
          }}
          indicatorColor="primary"
          textColor="primary"
          scrollable
          scrollButtons="auto"
        >
          {dashNames.map(name => <Tab key={name} label={name} />)}
        </Tabs>
      </AppBar>
      {render && (
        <ErrorBoundary msg="Dashboard crashed, try reloading">
          {render(which)}
        </ErrorBoundary>
      )}
    </div>
  )
);

DashboardSelector.displayName = 'DashboardSelector';

const MultiWrapper = (props: {
  activity: ActivityDBT,
  docs: Object,
  instances: Array<string | number>,
  users: { [string | number]: string },
  names?: string[]
}) => {
  const { activity, docs, names } = props;
  const aT = activityTypesObj[activity.activityType];
  const dashNames = names || Object.keys(aT.dashboard);
  return (
    <DashboardSelector
      dashNames={dashNames}
      render={which => {
        const w = which > dashNames.length ? 0 : which;
        const [doc] = (docs && docs[dashNames[w]]) || [];
        return <DashboardComp {...props} name={dashNames[w]} doc={doc} />;
      }}
    />
  );
};

export default MultiWrapper;
