// @flow

import * as React from 'react';
import { throttle, isEmpty } from 'lodash';
import { Meteor } from 'meteor/meteor';
import {
  cloneDeep,
  Inspector,
  type ActivityPackageT,
  type LogDbT,
  isBrowser
} from 'frog-utils';
import { CircularProgress } from '@material-ui/core/CircularProgress';

import { createDashboards } from '../../api/mergeLogData';
import { DashboardStates } from '../../api/cache';

import { DashboardSelector } from '../Dashboard/MultiWrapper';

if (isBrowser) {
  require('../LearningItem/sliderCSS');
}

const Slider = isBrowser
  ? require('rc-slider').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

type StateT = {
  data: any,
  logs: Object[],
  example: string,
  slider: { [example: string]: number },
  oldSlider: number,
  idx: number,
  play: number | false,
  exampleIdx?: number
};

type PropsT = {
  activityType: ActivityPackageT,
  showLogs?: boolean
};

class ShowDashExample extends React.Component<PropsT, StateT> {
  activityDbObject: Object;

  timeseries: LogDbT[][];

  logsProcessed: number = 0;

  isUnmounted: boolean = false;

  constructor(props: PropsT) {
    super(props);
    this.state = ({
      data: null,
      example: '',
      logs: [],
      oldSlider: 0,
      slider: {},
      idx: 0,
      play: false
    }: StateT);
    const aTdashs = this.props.activityType.dashboards;
    if (aTdashs) {
      const example = Object.keys(aTdashs).find(
        x => aTdashs[x] && aTdashs[x].exampleLogs
      );
      if (example && aTdashs[example]) {
        this.state.data = aTdashs[example].initData;
        this.state.example = example;
      }
    }
    const dashex = aTdashs?.[this.state.example]?.exampleLogs?.[0];
    if (!dashex) {
      return;
    }
    if (dashex.type === 'state') {
      this.state.data = dashex.state;
      this.setActivityObj(
        this.props.activityType.dashboards,
        this.props.activityType.meta?.exampleData?.[0]?.config || {}
      );
    } else {
      this.fetchLogs();
    }
  }

  setActivityObj = (dashboards: any, data: any) => {
    const dash = dashboards && dashboards[this.state.example];
    if (!dash || !dash.exampleLogs) {
      return;
    }
    const activityMerge =
      dash?.exampleLogs?.[this.state.idx]?.activityMerge || {};

    this.activityDbObject = {
      ...{
        _id: 'preview',
        data,
        groupingKey: 'group',
        plane: 2,
        startTime: 0,
        length: 3,
        activityType: this.props.activityType.id
      },
      ...activityMerge
    };
  };

  fetchLogs = (props: PropsT = this.props) => {
    const {
      meta: { exampleData },
      dashboards
    } = this.props.activityType;
    const data = (exampleData && exampleData[0].config) || {};

    const dash = dashboards && dashboards[this.state.example];
    if (
      !dash ||
      !dash.exampleLogs ||
      dash.exampleLogs[this.state.idx].type === 'state'
    ) {
      return;
    }

    this.setActivityObj(dashboards, data);

    Meteor.call(
      'get.example.logs',
      props.activityType.id,
      this.state.example,
      this.state.idx,
      (err, result) => {
        if (err || result === false) {
          console.warn(
            'Error getting example logs',
            props.activityType.id,
            this.state.example,
            err
          );
        }

        this.activityDbObject.actualStartingTime = new Date(
          result[0].timestamp
        );
        this.setState({ logs: result });
        if (!this.state.slider[this.state.example]) {
          this.setState(
            {
              slider: {
                ...this.state.slider,
                [this.state.example]: result.length - 1
              }
            },
            () => this.displaySubset(result.length - 1, undefined, true)
          );
        }
      }
    );
  };

  componentWillUnmount = () => (this.isUnmounted = true);

  clusterBySecond = () => {
    this.timeseries = [];
    this.state.logs.forEach(log => {
      const timeSeq = Math.floor(
        (new Date(log.timestamp) - this.activityDbObject.actualStartingTime) /
          1000
      );
      if (Array.isArray(this.timeseries[timeSeq])) {
        this.timeseries[timeSeq].push(log);
      } else {
        this.timeseries[timeSeq] = [log];
      }
    });
    this.loadBySeconds(this.state.play, 0);
  };

  loadBySeconds = (play: number | false, second: number) => {
    if (
      !this.isUnmounted &&
      this.state.play !== false &&
      play === this.state.play
    ) {
      if (this.timeseries[second]) {
        this.logsProcessed += this.timeseries[second].length;
        this.displaySubset(
          this.logsProcessed,
          this.timeseries[second],
          second === 0
        );
        this.setState({
          slider: {
            ...this.state.slider,
            [this.state.example]: this.logsProcessed
          }
        });
      }
      if (this.timeseries.length > second) {
        window.setTimeout(
          () => this.loadBySeconds(this.state.play, second + 1),
          1000 / [1, 2, 4, 8, 16, 32][this.state.play]
        );
      }
    }
  };

  displaySubset = (
    e: number,
    suppliedLogs?: LogDbT[],
    restart: boolean = false
  ) => {
    if (e === 0 && this.state.oldSlider === this.state.logs.length - 1) {
      // fixes bug which kept resetting the graphs after they were automatically pushed to the end
      return;
    }
    const aT = this.props.activityType;
    if (!aT.dashboards || !aT.dashboards[this.state.example]) {
      return;
    }
    const dash = aT.dashboards[this.state.example];
    const diff = e - this.state.oldSlider;
    const func = dash.prepareDataForDisplay;
    let logs;
    createDashboards(
      { activityType: aT.id, _id: 'showExampleLogs' },
      restart || diff < 0
    );
    if (diff > 0 || (suppliedLogs && !restart)) {
      logs = suppliedLogs || this.state.logs.slice(this.state.oldSlider, e);
    } else {
      logs = this.state.logs.slice(0, e);
    }
    this.activityDbObject.actualClosingTime =
      (suppliedLogs && suppliedLogs[suppliedLogs.length - 1].timestamp) ||
      this.state.logs[e].timestamp;

    const mergeLogFn = dash.mergeLog;
    logs.forEach(log =>
      mergeLogFn(
        DashboardStates['showExampleLogs-' + this.state.example],
        log,
        this.activityDbObject
      )
    );

    const data = func
      ? func(
          cloneDeep(DashboardStates['showExampleLogs-' + this.state.example]),
          this.activityDbObject
        )
      : DashboardStates['showExampleLogs-' + this.state.example];

    this.setState({ data, oldSlider: e });
  };

  throttledDisplaySubset = throttle(this.displaySubset, 1000, {
    leading: false
  });

  render() {
    const instances = [];
    const users = {};
    const { logs } = this.state;
    const aTdashs = this.props.activityType.dashboards;

    if (!aTdashs) {
      return <p>Activity type has no dashboard</p>;
    }

    const dashNames = Object.keys(aTdashs).filter(
      x => aTdashs[x] && aTdashs[x].exampleLogs
    );
    const dash = aTdashs[this.state.example];
    if (!dash && !dash.exampleLogs) {
      return <p>The chosen dashboard has no example logs/state</p>;
    }
    const examples = (dash.exampleLogs || []).map(x => x.title);
    const Viewer = aTdashs[this.state.example].Viewer;
    if (
      (aTdashs[this.state.example].exampleLogs?.[this.state.idx].type ===
        'logs' &&
        !this.state.logs) ||
      (aTdashs[this.state.example].exampleLogs?.[this.state.idx].type ===
        'state' &&
        !this.state.data)
    ) {
      return <CircularProgress />;
    }
    return (
      <React.Fragment>
        <div style={{ height: '30px' }}>
          <DashboardSelector
            selected={this.state.exampleIdx}
            onChange={x => {
              this.logsProcessed = 0;
              const mydash = aTdashs[dashNames[x]];
              let data;
              if (mydash?.exampleLogs?.[x]?.type === 'state') {
                data = mydash.exampleLogs[x].state;
              } else if (mydash.prepareDataForDisplay) {
                data = mydash.prepareDataForDisplay(
                  mydash.initData,
                  this.activityDbObject
                );
              } else {
                data = mydash.initData;
              }
              this.setState(
                {
                  slider: { ...this.state.slider, [this.state.example]: 0 },
                  oldSlider: 0,
                  data,
                  logs: [],
                  idx: 0,
                  exampleIdx: x,
                  example: dashNames[x],
                  play: false
                },
                () => this.fetchLogs()
              );
            }}
            dashNames={dashNames}
          />
        </div>
        <div style={{ height: '30px' }}>
          <DashboardSelector
            selected={this.state.idx}
            onChange={x => {
              this.logsProcessed = 0;
              const mydash = aTdashs[this.state.example];
              let data;
              if (mydash?.exampleLogs?.[x].type === 'state') {
                data = mydash.exampleLogs?.[x].state;
              } else if (mydash.prepareDataForDisplay) {
                data = mydash.prepareDataForDisplay(
                  mydash.initData,
                  this.activityDbObject
                );
              } else {
                data = mydash.initData;
              }
              this.setState(
                {
                  oldSlider: 0,
                  slider: { ...this.state.slider, [this.state.example]: 0 },
                  data,
                  logs: [],
                  idx: x,
                  play: false
                },
                () => this.fetchLogs()
              );
            }}
            dashNames={examples}
          />
        </div>
        {!isEmpty(this.state.logs) && (
          <React.Fragment>
            <div style={{ height: '30px' }}>
              <DashboardSelector
                onChange={x => {
                  if (this.state.play === x) {
                    this.setState({ play: false });
                  } else {
                    let data;
                    if (dash.prepareDataForDisplay) {
                      data = dash.prepareDataForDisplay(
                        dash.initData,
                        this.activityDbObject
                      );
                    } else {
                      data = dash.initData;
                    }
                    this.setState(
                      {
                        data,
                        oldSlider: 0,
                        play: x
                      },
                      () => {
                        this.logsProcessed = 0;
                        this.clusterBySecond();
                      }
                    );
                  }
                }}
                dashNames={['1x', '2x', '4x', '8x', '16x', '32x']}
                selected={this.state.play || 0}
              />
            </div>
            <Slider
              value={this.state.slider[this.state.example] || 0}
              min={0}
              max={logs.length - 1}
              onChange={e => {
                this.setState({
                  play: false,
                  slider: { ...this.state.slider, [this.state.example]: e }
                });
                this.throttledDisplaySubset(e);
              }}
            />
          </React.Fragment>
        )}
        {this.props.showLogs ? (
          <Inspector data={this.state.logs} />
        ) : (
          <Viewer
            users={users}
            activity={this.activityDbObject}
            instances={instances}
            config={this.activityDbObject.data}
            state={this.state.data}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ShowDashExample;
