// @flow

import * as React from 'react';
import { isEqual } from 'lodash';
import Spinner from 'react-spinner';
import { withState } from 'recompose';
import {
  cloneDeep,
  type LogT,
  type LogDBT,
  type ActivityPackageT,
  type ActivityDBT
} from 'frog-utils';

import { mergeLog, createDashboards } from '../../api/mergeLogData';
import DashMultiWrapper from '../Dashboard/MultiWrapper';
import { activityTypesObj } from '../../activityTypes';
import { DashboardStates } from '../../api/cache';

export const DocumentCache = {};
export const Logs: LogDBT[] = [];

export const initDashboardDocuments = (
  activityType: ActivityPackageT,
  refresh: boolean
) => {
  if (activityType && activityType.dashboards) {
    createDashboards(
      { activityType: activityType.id, _id: activityType.id },
      refresh
    );
  }
};

export const hasDashExample = (aT: ActivityPackageT) =>
  aT.dashboard &&
  Object.keys(aT.dashboard).reduce(
    (acc, name) => acc || !!aT.dashboard[name].exampleLogs,
    false
  );

export const activityDbObject = (
  config: Object,
  activityType: string,
  startingTime?: Date
) => ({
  _id: activityType,
  data: config,
  groupingKey: 'group',
  plane: 2,
  startTime: 0,
  actualStartingTime: startingTime || new Date(Date.now()),
  length: 3,
  activityType
});

export const mergeData = (
  aT: ActivityPackageT,
  log: LogDBT,
  config: Object,
  startingTime?: Date
) => {
  if (aT.dashboard) {
    Object.keys(aT.dashboard).forEach(name => {
      if (DocumentCache[name]) {
        const dash = aT.dashboard[name];
        const [doc, dataFn] = DocumentCache[name];
        dash.mergeLog(
          doc.data,
          dataFn,
          log,
          activityDbObject(config, aT.id, startingTime)
        );
      }
    });
  }
};

export const createLogger = (
  sessionId: string,
  instanceId: string,
  activityType: string,
  activityId: string,
  userId: string,
  activityPlane: number,
  config: Object
) => {
  const aT = activityTypesObj[activityType];

  initDashboardDocuments(aT, false);

  const startingTime = new Date();
  const logExtra = {
    userId,
    sessionId,
    activityType,
    activityId: activityType,
    activityPlane,
    instanceId
  };
  const logger = (logItems: Array<LogT> | LogT) => {
    const extra = {
      ...logExtra,
      timestamp: new Date()
    };
    const items = Array.isArray(logItems) ? logItems : [logItems];

    Logs.push(...items.map(x => ({ ...x, ...extra })));
    mergeLog(items, extra);
  };
  return logger;
};

class PreviewDash extends React.Component<
  {
    name: string,
    activity: ActivityDBT,
    instances: Object,
    users: Object,
    config: Object
  },
  { state: any }
> {
  interval: any;
  oldInput: any = undefined;
  func = activityTypesObj[this.props.activity.activityType].dashboards[
    this.props.name
  ].prepareDisplay;

  dashId = this.props.activity._id + '-' + this.props.name;

  state = {
    state:
      DashboardStates[this.dashId] &&
      (this.func
        ? this.func(cloneDeep(DashboardStates[this.dashId]))
        : DashboardStates[this.dashId])
  };

  componentDidMount = () => {
    this.interval = setInterval(this.update, 300);
  };

  update = () => {
    if (DashboardStates[this.dashId]) {
      if (!isEqual(this.oldInput, DashboardStates[this.dashId])) {
        const newState = this.func
          ? this.func(cloneDeep(DashboardStates[this.dashId]))
          : DashboardStates[this.dashId];
        this.setState({ state: newState });
        this.oldInput = cloneDeep(DashboardStates[this.dashId]);
      }
    }
  };

  componentWillUnmount = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  render = () => {
    const Viewer =
      activityTypesObj[this.props.activity.activityType].dashboards[
        this.props.name
      ].Viewer;
    return this.state.state ? (
      <Viewer
        state={this.state.state}
        activity={this.props.activity}
        config={this.props.config}
        instances={this.props.instances}
        users={this.props.users}
      />
    ) : null;
  };
}

export const DashPreviewWrapper = withState('ready', 'setReady', false)(
  (props: Object) => {
    const { instances, users, activityType, config, ready, setReady } = props;
    if (!ready) {
      initDashboardDocuments(activityType, false);
      setReady(true);
    }
    console.log(config);
    return ready ? (
      <DashMultiWrapper
        activity={activityDbObject(config, activityType.id)}
        instances={instances}
        users={users}
      >
        {e => (
          <PreviewDash
            key={activityType.id + 'e'}
            name={e}
            activity={activityDbObject(config, activityType.id)}
            config={config}
            instances={instances}
            users={users}
          />
        )}
      </DashMultiWrapper>
    ) : (
      <Spinner />
    );
  }
);
