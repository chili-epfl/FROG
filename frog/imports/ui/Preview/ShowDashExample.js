// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  cloneDeep,
  Inspector,
  type ActivityPackageT,
  LogDBT
} from 'frog-utils';
import { throttle } from 'lodash';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Spinner from 'react-spinner';

import { mergeLog, createDashboards } from '../../api/mergeLogData';
import { DashboardStates } from '../../../imports/api/cache';

import { DashboardSelector } from '../Dashboard/MultiWrapper';

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
  timeseries: LogDBT[][];
  logsProcessed: number = 0;
  isUnmounted: boolean = false;

  constructor(props: PropsT) {
    super(props);
    const aT = this.props.activityType;
    const example = Object.keys(aT.dashboards).filter(
      x => aT.dashboards[x].exampleLogs
    )[0];
    this.state = {
      data: aT.dashboards[example].initData,
      example,
      logs: [],
      oldSlider: 0,
      slider: {},
      idx: 0,
      play: false
    };
    this.fetchLogs();
  }

  fetchLogs = (props: PropsT = this.props) => {
    const { meta: { exampleData }, dashboards } = this.props.activityType;
    const data = (exampleData && exampleData[0].config) || {};

    const { activityMerge } = dashboards[this.state.example].exampleLogs[0];

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
    Meteor.call(
      'get.example.logs',
      props.activityType.id,
      this.state.example,
      this.state.idx,
      (err, result) => {
        if (err || result === false) {
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
            () => this.displaySubset(result.length - 1, false, true)
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
        this.displaySubset(second, this.timeseries[second], second === 0);
        this.logsProcessed =
          this.logsProcessed + this.timeseries[second].length;
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
    suppliedLogs?: LogDBT[],
    restart: boolean = false
  ) => {
    if (e === 0 && this.state.oldSlider === this.state.logs.length - 1) {
      // fixes bug which kept resetting the graphs after they were automatically pushed to the end
      return;
    }
    const aT = this.props.activityType;
    const diff = e - this.state.oldSlider;
    const func = aT.dashboards[this.state.example].prepareDisplay;
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

    const mergeLogFn = aT.dashboards[this.state.example].mergeLog;
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

  throttledDisplaySubset = throttle(this.displaySubset, 500, {
    leading: false
  });

  render() {
    const instances = [];
    const users = {};
    const { logs } = this.state;
    const aT = this.props.activityType;
    const dashNames = Object.keys(aT.dashboards).filter(
      x => aT.dashboards[x].exampleLogs
    );
    const examples = aT.dashboards[this.state.example].exampleLogs.map(
      x => x.title
    );
    const Viewer = aT.dashboards[this.state.example].Viewer;
    if (!this.state.logs) {
      return <Spinner />;
    }
    return (
      <React.Fragment>
        <div style={{ height: '30px' }}>
          <DashboardSelector
            selected={this.state.exampleIdx}
            onChange={x => {
              this.logsProcessed = 0;
              this.setState(
                {
                  oldSlider: 0,
                  data: aT.dashboards[dashNames[x]].initData,
                  example: dashNames[x],
                  exampleIdx: x,
                  logs: [],
                  idx: 0,
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
              this.setState(
                {
                  oldSlider: 0,
                  data: aT.dashboards[this.state.example].initData,
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
        <div style={{ height: '30px' }}>
          <DashboardSelector
            onChange={x => {
              if (this.state.play === x) {
                this.setState({ play: false });
              } else {
                this.setState(
                  {
                    oldSlider: 0,
                    data: aT.dashboards[this.state.example].initData,
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
              slider: { ...this.state.slider, [this.state.example]: e }
            });
            this.throttledDisplaySubset(e);
          }}
        />
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
