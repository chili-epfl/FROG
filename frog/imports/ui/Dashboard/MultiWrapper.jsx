// @flow

import * as React from 'react';
import { type ActivityDBT } from 'frog-utils';
import { isEqual, isEmpty } from 'lodash';

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
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden'
  },
  dash: {
    height: 'calc(100% - 48px)',
    overflow: 'auto'
  }
});

type PropsT = {
  classes: any,
  dashNames: string[],
  children?: Function,
  onChange?: Function,
  selected?: number
};

class DashboardRaw extends React.Component<PropsT, { which: number }> {
  constructor() {
    super();
    this.state = { which: 0 };
  }

  componentWillReceiveProps(nextProps: PropsT) {
    if (!isEqual(this.props.dashNames, nextProps.dashNames)) {
      this.setState({ which: 0 });
    }
  }

  render() {
    const { dashNames, onChange, classes, selected, children } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={selected !== undefined ? selected : this.state.which}
            onChange={(_, x) => {
              if (onChange) {
                onChange(x);
              }
              this.setState({ which: x });
            }}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {dashNames.map(name => <Tab key={name} label={name} />)}
          </Tabs>
        </AppBar>
        {children && (
          <div className={classes.dash}>
            <ErrorBoundary msg="Dashboard crashed, try reloading">
              {children(
                this.state.which > dashNames.length
                  ? 0
                  : dashNames[this.state.which]
              )}
            </ErrorBoundary>
          </div>
        )}
      </div>
    );
  }
}

export const DashboardSelector: React.ComponentType<
  $Diff<PropsT, { classes: any }>
> = withStyles(styles)(DashboardRaw);
DashboardSelector.displayName = 'DashboardSelector';

const MultiWrapper = (props: {
  activity: ActivityDBT,
  names?: string[],
  children?: Function,
  users: Object,
  instances: any
}) => {
  const { activity, names, children, users, instances } = props;
  const aT = activityTypesObj[activity.activityType];
  const dashNames = names || Object.keys(aT.dashboards || {});
  if (isEmpty(dashNames)) {
    return null;
  }

  return (
    <DashboardSelector dashNames={dashNames} onChange={() => {}}>
      {children ||
        (which => (
          <DashboardComp
            {...props}
            name={which}
            key={which + activity._id}
            users={users}
            instances={instances}
          />
        ))}
    </DashboardSelector>
  );
};

export default MultiWrapper;
