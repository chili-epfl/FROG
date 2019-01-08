// @flow

import * as React from 'react';
import { throttle, isEmpty } from 'lodash';
import { Paper } from '@material-ui/core';
import {
  cloneDeep,
  Inspector,
  type ActivityPackageT,
  type LogDbT,
  isBrowser
} from 'frog-utils';
import { CircularProgress } from '@material-ui/core/CircularProgress';

import { createDashboards } from '/imports/api/mergeLogData';
import { DashboardStates } from '/imports/api/cache';

import { DashboardSelector } from '../Dashboard/MultiWrapper';

if (isBrowser) {
  require('/imports/client/LearningItem/sliderCSS');
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
    const {
      activityType: { dashboards: aTdashs }
    } = this.props;
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
    const dashExample = dash?.exampleLogs?.[this.state.idx];
    if (!dashExample || dashExample.type === 'state') {
      return;
    }

    this.setActivityObj(dashboards, data);

    fetch(dashExample.path)
      .then(response => response.text())
      .then(rawResult => {
        const result = rawResult
          .trim()
          .split('\n')
          .map(x => JSON.parse(x));

        this.activityDbObject.actualStartingTime = new Date(
          result[0].timestamp
        );
        this.setState({ logs: result });
        if (!this.state.slider[this.state.example]) {
          this.setState(
            state => ({
              slider: {
                ...state.slider,
                [state.example]: result.length - 1
              }
            }),
            () => this.displaySubset(result.length - 1, undefined, true)
          );
        }
      })
      .catch(err =>
        console.warn(
          'Error getting example logs',
          props.activityType.id,
          this.state.example,
          err
        )
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
        this.setState(state => ({
          slider: {
            ...state.slider,
            [state.example]: this.logsProcessed
          }
        }));
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
    const { oldSlider, example, logs } = this.state;

    if (e === 0 && oldSlider === logs.length - 1) {
      // fixes bug which kept resetting the graphs after they were automatically pushed to the end
      return;
    }
    const { activityType: aT } = this.props;
    if (!aT.dashboards || !aT.dashboards[example]) {
      return;
    }
    const dash = aT.dashboards[example];
    const diff = e - oldSlider;
    const func = dash.prepareDataForDisplay;
    let _logs;
    createDashboards(
      { activityType: aT.id, _id: 'showExampleLogs' },
      restart || diff < 0
    );
    if (diff > 0 || (suppliedLogs && !restart)) {
      _logs = suppliedLogs || logs.slice(oldSlider, e);
    } else {
      _logs = logs.slice(0, e);
    }
    this.activityDbObject.actualClosingTime =
      (suppliedLogs && suppliedLogs[suppliedLogs.length - 1].timestamp) ||
      logs[e].timestamp;

    const mergeLogFn = dash.mergeLog;
    _logs.forEach(log =>
      mergeLogFn(
        DashboardStates['showExampleLogs-' + example],
        log,
        this.activityDbObject
      )
    );

    const data = func
      ? func(
          cloneDeep(DashboardStates['showExampleLogs-' + example]),
          this.activityDbObject
        )
      : DashboardStates['showExampleLogs-' + example];

    this.setState({ data, oldSlider: e });
  };

  throttledDisplaySubset = throttle(this.displaySubset, 1000, {
    leading: false
  });

  render() {
    const instances = [];
    const users = {};
    const { logs, example, idx, exampleIdx, slider, data, play } = this.state;
    const { activityType } = this.props;
    const aTdashs = activityType.dashboards;

    if (!aTdashs) {
      return <p>Activity type has no dashboard</p>;
    }

    const dashNames = Object.keys(aTdashs).filter(
      x => aTdashs[x] && aTdashs[x].exampleLogs
    );
    const dash = aTdashs[example];
    if (!dash && !dash.exampleLogs) {
      return <p>The chosen dashboard has no example logs/state</p>;
    }
    const examples = (dash.exampleLogs || []).map(x => x.title);
    const Viewer = aTdashs[example].Viewer;
    if (
      (aTdashs[example].exampleLogs?.[idx].type === 'logs' && !logs) ||
      (aTdashs[example].exampleLogs?.[idx].type === 'state' && !data)
    ) {
      return <CircularProgress />;
    }
    return (
      <div style={{ overflow: 'hidden' }}>
        <div style={{ height: '30px' }}>
          <DashboardSelector
            selected={exampleIdx}
            onChange={x => {
              this.logsProcessed = 0;
              const mydash = aTdashs[dashNames[x]];
              let _data;
              const exLogs = mydash?.exampleLogs?.[x];
              if (exLogs && exLogs.type === 'state') {
                _data = exLogs.state;
              } else if (mydash.prepareDataForDisplay) {
                _data = mydash.prepareDataForDisplay(
                  mydash.initData,
                  this.activityDbObject
                );
              } else {
                _data = mydash.initData;
              }
              this.setState(
                {
                  slider: { ...slider, [example]: 0 },
                  oldSlider: 0,
                  data: _data,
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
            selected={idx}
            onChange={x => {
              this.logsProcessed = 0;
              const mydash = aTdashs[example];
              let _data;
              const exLogs = mydash?.exampleLogs?.[x];
              if (exLogs && exLogs.type === 'state') {
                _data = exLogs.state;
              } else if (mydash.prepareDataForDisplay) {
                _data = mydash.prepareDataForDisplay(
                  mydash.initData,
                  this.activityDbObject
                );
              } else {
                _data = mydash.initData;
              }
              this.setState(
                {
                  oldSlider: 0,
                  slider: { ...slider, [example]: 0 },
                  data: _data,
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
        {!isEmpty(logs) && (
          <React.Fragment>
            <div style={{ height: '30px' }}>
              <DashboardSelector
                onChange={x => {
                  if (play === x) {
                    this.setState({ play: false });
                  } else {
                    let _data;
                    if (dash.prepareDataForDisplay) {
                      _data = dash.prepareDataForDisplay(
                        dash.initData,
                        this.activityDbObject
                      );
                    } else {
                      _data = dash.initData;
                    }
                    this.setState(
                      {
                        data: _data,
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
                selected={play || 0}
              />
            </div>
            <Slider
              value={slider[example] || 0}
              min={0}
              max={logs.length - 1}
              onChange={e => {
                this.setState({
                  play: false,
                  slider: { ...slider, [example]: e }
                });
                this.throttledDisplaySubset(e);
              }}
            />
          </React.Fragment>
        )}
        <Paper style={{ height: 'calc(100vh - 250px)' }}>
          {this.props.showLogs ? (
            <Inspector data={logs} />
          ) : (
            <Viewer
              users={users}
              activity={this.activityDbObject}
              object={{
                activityData: {
                  structure: 'all',
                  payload: { all: { data: {}, config: {} } }
                },
                socialStructure: {},
                globalStructure: { students: {}, studentIds: [] }
              }}
              instances={instances}
              config={this.activityDbObject.data}
              state={this.state.data}
            />
          )}
        </Paper>
      </div>
    );
  }
}

export default ShowDashExample;
