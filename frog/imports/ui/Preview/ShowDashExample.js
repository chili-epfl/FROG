// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { type ActivityPackageT, pureObjectReactive } from 'frog-utils';
import _, { throttle, cloneDeep } from 'lodash';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Inspector from 'react-inspector';

import { activityDbObject } from './dashboardInPreviewAPI';
import { DashboardSelector } from '../Dashboard/MultiWrapper';

type StateT = {
  data: any,
  logs: Object[],
  example: string,
  slider: { [example: string]: number },
  oldSlider: number,
  idx: number
};

type PropsT = {
  activityType: ActivityPackageT,
  example: number,
  showLogs?: boolean
};

class ShowDashExample extends React.Component<PropsT, StateT> {
  activityDbObject: Object;

  constructor(props: PropsT) {
    super(props);
    const aT = this.props.activityType;
    const example = Object.keys(aT.dashboard).filter(
      x => aT.dashboard[x].exampleLogs
    )[0];
    this.state = {
      data: aT.dashboard[example].initData,
      example,
      logs: [],
      oldSlider: 0,
      slider: {},
      idx: 0
    };
    this.fetchLogs();
  }

  fetchLogs = (props: PropsT = this.props) => {
    const { meta: { exampleData }, dashboard } = this.props.activityType;
    const data = (exampleData && exampleData[0].config) || {};

    const { activityMerge } = dashboard[this.state.example].exampleLogs[0];

    this.activityDbObject = {
      ...{
        _id: 'preview',
        data,
        groupingKey: 'group',
        plane: 2,
        startTime: 0,
        actualStartingTime: new Date(Date.now()),
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
          console.error('Error fetching logs', err);
        }
        this.setState({ logs: result });
      }
    );
  };

  displaySubset = (e: number) => {
    const aT = this.props.activityType;
    const config = this.activityDbObject.data || {};
    const mergeLog = aT.dashboard[this.state.example].mergeLog;
    const diff = e - this.state.oldSlider;
    let tempDb;
    let logs;

    if (diff > 0) {
      tempDb = pureObjectReactive(cloneDeep(this.state.data));
      logs = this.state.logs.slice(this.state.oldSlider, e);
    } else {
      tempDb = pureObjectReactive(
        cloneDeep(aT.dashboard[this.state.example].initData)
      );
      logs = this.state.logs.slice(0, e);
    }
    const [doc, dataFn] = tempDb;

    logs.forEach(log =>
      mergeLog(doc.data, dataFn, log, activityDbObject(config, aT.id))
    );

    this.setState({ data: tempDb[0].data, oldSlider: e });
  };

  throttledDisplaySubset = throttle(this.displaySubset, 500, {
    leading: false
  });

  render() {
    const instances = [];
    const users = {};
    const { logs } = this.state;
    const aT = this.props.activityType;
    const dashNames = Object.keys(aT.dashboard).filter(
      x => aT.dashboard[x].exampleLogs
    );
    const examples = aT.dashboard[this.state.example].exampleLogs.map(
      x => x.title
    );
    const Viewer = aT.dashboard[this.state.example].Viewer;

    return (
      <React.Fragment>
        <DashboardSelector
          onChange={x => {
            this.setState(
              {
                oldSlider: 0,
                data: aT.dashboard[x].initData,
                example: x,
                logs: [],
                idx: 0
              },
              () => this.fetchLogs()
            );
          }}
          dashNames={dashNames}
        />
        <DashboardSelector
          onChange={x => {
            this.setState(
              {
                oldSlider: 0,
                data: aT.dashboard[this.state.example].initData,
                logs: [],
                idx: x
              },
              () => this.fetchLogs()
            );
          }}
          dashNames={examples}
          returnIdx
        />
        <Slider
          value={this.state.slider[this.state.example] || 0}
          min={0}
          max={logs.length}
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
            data={this.state.data}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ShowDashExample;
