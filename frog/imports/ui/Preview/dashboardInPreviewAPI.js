// @flow

import * as React from 'react';
import { uniq, isEqual } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withState } from 'recompose';
import {
  cloneDeep,
  values,
  type LogT,
  type ActivityPackageT,
  type ActivityDbT
} from 'frog-utils';

import { connection } from './Preview';
import { mergeLog, createDashboards } from '../../api/mergeLogData';
import DashMultiWrapper from '../Dashboard/MultiWrapper';
import { activityTypesObj } from '../../activityTypes';
import { DashboardStates } from '../../api/cache';
import { ShowInfoDash } from './ShowInfo';
import { generateDataFn } from './Content';

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

const reactiveWrapper = (act, reactiveToDisplay: Function) => {
  const query = connection.createSubscribeQuery('rz', {
    _id: { $regex: '^preview-' + act.activityType + '/' }
  });

  return (_, __) => {
    if (!query.ready) {
      return null;
    }
    const data = (query.results || []).reduce(
      (acc, res) => ({
        ...acc,
        [res.id.split('/')[1]]: res.data
      }),
      {}
    );
    return reactiveToDisplay(data, act);
  };
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
  prepDataFn: Function;
  aT: Object;
  dash: ?Object;
  dataFn: any;
  oldState: any = {};

  dashId = this.props.activity._id + '-' + this.props.name;

  constructor(props) {
    super(props);
    this.dataFn = generateDataFn();
    this.aT = activityTypesObj[this.props.activity.activityType];
    this.dash = this.aT?.dashboards?.[this.props.name];
    if (this.dash) {
      if (this.dash.prepareDataForDisplay) {
        this.prepDataFn = this.dash.prepareDataForDisplay;
      } else if (this.dash.reactiveToDisplay) {
        this.prepDataFn = reactiveWrapper(
          this.props.activity,
          this.dash.reactiveToDisplay
        );
      } else {
        this.prepDataFn = (x, _) => x;
      }
    }

    const dashState = DashboardStates[this.dashId];
    this.state = {
      state:
        dashState && this.prepDataFn(cloneDeep(dashState), this.props.activity)
    };
  }

  componentDidMount = () => {
    this.interval = setInterval(
      () => this.update(this.dash?.reactiveToDisplay),
      1000
    );
  };

  update = reactive => {
    if (DashboardStates[this.dashId]) {
      if (reactive || !isEqual(this.oldInput, DashboardStates[this.dashId])) {
        const newState = this.prepDataFn(
          cloneDeep(DashboardStates[this.dashId]),
          this.props.activity
        );
        if (!isEqual(this.oldState, newState)) {
          this.setState({ state: newState });
        }
        this.oldState = newState;
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
    if (!this.aT) {
      return <p>Chose an activity type</p>;
    }
    if (!this.dash) {
      return <p>This activity has no dashboard</p>;
    }
    const Viewer = this.dash.Viewer;
    return this.state.state ? (
      this.props.showData ? (
        <ShowInfoDash
          state={DashboardStates[this.dashId]}
          prepareDataForDisplay={
            this.dash.prepareDataForDisplay ? this.state.state : null
          }
        />
      ) : (
        <Viewer
          state={this.state.state}
          activity={this.props.activity}
          instances={uniq(this.props.instances)}
          users={this.props.users}
          LearningItem={this.dataFn.LearningItem}
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
      <CircularProgress />
    );
  }
);
