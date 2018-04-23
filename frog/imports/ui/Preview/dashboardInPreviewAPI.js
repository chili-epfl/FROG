// @flow

import * as React from 'react';
import { uniq, isEqual } from 'lodash';
import Spinner from 'react-spinner';
import { withState } from 'recompose';
import {
  cloneDeep,
  values,
  type LogT,
  type ActivityPackageT,
  type ActivityDbT
} from 'frog-utils';

import { mergeLog, createDashboards } from '../../api/mergeLogData';
import DashMultiWrapper from '../Dashboard/MultiWrapper';
import { activityTypesObj } from '../../activityTypes';
import { DashboardStates } from '../../api/cache';
import { ShowInfoDash } from './ShowInfo';

export const DocumentCache = {};
export const Logs: Object[] = [];

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
  aT.dashboards &&
  values(aT.dashboards).reduce(
    (acc, dash) => acc || (dash && !!dash.exampleLogs),
    false
  );

export const activityDbObject = (
  config: Object,
  activityType: string,
  startingTime?: Date,
  plane: number
): ActivityDbT => ({
  _id: activityType,
  data: config,
  groupingKey: plane === 2 ? 'group' : '',
  plane,
  actualStartingTime: startingTime || new Date(Date.now()),
  startTime: 0,
  length: 3,
  activityType
});

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

  const actualStartingTime = new Date();
  const logExtra = {
    userId,
    sessionId,
    activityType,
    activityId,
    activityPlane,
    instanceId
  };
  const logger = (logItems: Array<LogT> | LogT) => {
    const extra = {
      ...logExtra,
      timestamp: new Date()
    };
    const items = Array.isArray(logItems) ? logItems : [logItems];
    items.forEach(x => Logs.push({ ...x, ...extra }));
    const acDbObj = activityDbObject(
      config,
      activityId,
      actualStartingTime,
      activityPlane
    );
    mergeLog(items, extra, acDbObj);
  };
  return logger;
};

class PreviewDash extends React.Component<
  {
    name: string,
    activity: ActivityDbT,
    instances: Object,
    users: Object,
    showData: boolean
  },
  { state: any }
> {
  interval: any;
  oldInput: any = undefined;
  func = activityTypesObj[this.props.activity.activityType].dashboards[
    this.props.name
  ].prepareDataForDisplay;

  dashId = this.props.activity._id + '-' + this.props.name;

  state = {
    state:
      DashboardStates[this.dashId] &&
      (this.func
        ? this.func(
            cloneDeep(DashboardStates[this.dashId]),
            this.props.activity
          )
        : DashboardStates[this.dashId])
  };

  componentDidMount = () => {
    this.interval = setInterval(this.update, 300);
  };

  update = () => {
    if (DashboardStates[this.dashId]) {
      if (!isEqual(this.oldInput, DashboardStates[this.dashId])) {
        const newState = this.func
          ? this.func(
              cloneDeep(DashboardStates[this.dashId]),
              this.props.activity
            )
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
    const aT = activityTypesObj[this.props.activity.activityType];
    if (!aT) {
      return <p>Chose an activity type</p>;
    }
    const dash = aT.dashboards && aT.dashboards[this.props.name];
    if (!dash) {
      return <p>This activity has no dashboard</p>;
    }
    const Viewer = dash.Viewer;
    return this.state.state ? (
      this.props.showData ? (
        <ShowInfoDash
          state={DashboardStates[this.dashId]}
          prepareDataForDisplay={
            dash.prepareDataForDisplay ? this.state.state : null
          }
        />
      ) : (
        <Viewer
          state={this.state.state}
          activity={this.props.activity}
          instances={uniq(this.props.instances)}
          users={this.props.users}
        />
      )
    ) : null;
  };
}

export const DashPreviewWrapper = withState('ready', 'setReady', false)(
  (props: Object) => {
    const {
      instances,
      users,
      activityType,
      config,
      ready,
      setReady,
      showData,
      plane
    } = props;
    if (!ready) {
      initDashboardDocuments(activityType, false);
      setReady(true);
    }
    const activity = activityDbObject(
      config,
      activityType.id,
      undefined,
      plane
    );
    return ready ? (
      <DashMultiWrapper activity={activity} instances={instances} users={users}>
        {e => (
          <PreviewDash
            showData={showData}
            key={activityType.id + e}
            name={e}
            activity={activity}
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
