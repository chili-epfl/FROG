// @flow

import * as React from 'react';
import { type ActivityDBT } from 'frog-utils';
import { isEqual } from 'lodash';

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

type PropsT = {
  classes: any,
  dashNames: string[],
  render?: Function,
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
    const { dashNames, render, onChange, classes, selected } = this.props;
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
        {render && (
          <ErrorBoundary msg="Dashboard crashed, try reloading">
            {render(this.state.which)}
          </ErrorBoundary>
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
      onChange={() => {}}
      render={which => {
        const w = which > dashNames.length ? 0 : which;
        const [doc] = (docs && docs[dashNames[w]]) || [];
        return <DashboardComp {...props} name={dashNames[w]} doc={doc} />;
      }}
    />
  );
};

export default MultiWrapper;
