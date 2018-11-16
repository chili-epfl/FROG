// @flow

import * as React from 'react';
import { type ActivityDbT } from 'frog-utils';
import { isEqual, isEmpty } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';

import { activityTypesObj } from '../../activityTypes';
import { DashboardComp } from './index';
import { ErrorBoundary } from '../App/ErrorBoundary';
import { teacherLogger } from '../../api/logs';

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
  },
  tabs: { minWidth: '0px', paddingLeft: '0px', paddingRight: '0px' }
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
            classes={{ root: classes.tabs }}
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
            {dashNames.map(name => (
              <Tab
                key={name}
                label={name}
                disableRipple
                classes={{ root: classes.tabs }}
              />
            ))}
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
  object: Object,
  activity: ActivityDbT,
  names?: string[],
  children?: Function,
  users: Object,
  instances: any,
  dashboardData?: Object,
  session?: Object,
  object: Object,
  ready?: boolean
}) => {
  const {
    dashboardData,
    activity,
    names,
    children,
    users,
    instances,
    session,
    object,
    ready
  } = props;
  if (!ready) {
    return <CircularProgress />;
  }
  const aT = activityTypesObj[activity.activityType];
  const dashNames = names || Object.keys(aT.dashboards || {});
  if (isEmpty(dashNames)) {
    return null;
  }
  if (aT.meta?.supportsLearningItems) {
    dashNames.unshift('Learning Items');
  }

  return (
    <DashboardSelector
      dashNames={dashNames}
      onChange={id => {
        if (session) {
          teacherLogger(
            session._id,
            'teacher.switchActivityDashboard',
            activity._id + '-' + dashNames[id]
          );
        }
      }}
    >
      {children ||
        (which => (
          <DashboardComp
            {...props}
            data={
              (
                (dashboardData &&
                  dashboardData.find(
                    x => x.dashId === activity._id + '-' + which
                  )) ||
                {}
              ).data
            }
            name={which}
            key={which + activity._id}
            users={users}
            instances={instances}
            object={object}
          />
        ))}
    </DashboardSelector>
  );
};

export default MultiWrapper;
