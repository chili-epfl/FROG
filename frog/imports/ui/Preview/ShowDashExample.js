// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { type ActivityPackageT } from 'frog-utils';
import { throttle } from 'lodash';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Spinner from 'react-spinner';
import Inspector from 'react-inspector';

import {
  initDocuments,
  DocumentCache,
  mergeData,
  ensureReady
} from './dashboardInPreviewAPI';
import { DashboardSelector } from '../Dashboard/MultiWrapper';
import { DashboardComp } from '../Dashboard';

type StateT = {
  ready: boolean,
  logs: Object[],
  example: string,
  slider: { [example: string]: number },
  wait: boolean
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
    this.state = {
      example: Object.keys(aT.dashboard).filter(
        x => aT.dashboard[x].exampleLogs
      )[0],
      ready: false,
      logs: [],
      slider: {},
      wait: true
    };
    this.fetchLogs();
  }

  componentDidMount() {
    ensureReady(this.props.activityType, () => this.setState({ ready: true }));
  }

  componentWillReceiveProps(nextProps: PropsT) {
    this.fetchLogs(nextProps);
  }

  fetchLogs = (props: PropsT = this.props) => {
    const { meta: { exampleData }, dashboard } = this.props.activityType;
    const data = (exampleData && exampleData[0].config) || {};

    const name = Object.keys(dashboard).find(n => dashboard[n].exampleLogs);
    const { activityMerge } = dashboard[name].exampleLogs[this.props.example];

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
      name,
      props.example,
      (err, result) => {
        if (err) {
          console.error('Error fetching logs', err);
        }
        this.setState({ logs: result });
      }
    );
  };

  displaySubset = (e: number) => {
    const aT = this.props.activityType;
    const config = this.activityDbObject.data || {};
    initDocuments(aT, true, this.state.example);
    this.state.logs
      .slice(0, e)
      .forEach(log => mergeData(aT, log, config, this.state.example));
  };

  throttledDisplaySubset = throttle(this.displaySubset, 2000, {
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

    return (
      <React.Fragment>
        {this.state.ready ? (
          <React.Fragment>
            <DashboardSelector
              onChange={x => this.setState({ example: x })}
              dashNames={dashNames}
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
              <DashboardComp
                activity={this.activityDbObject}
                wait={this.state.wait}
                config={this.activityDbObject.data}
                instances={instances}
                name={this.state.example}
                users={users}
                activityType={this.props.activityType}
                doc={DocumentCache[this.state.example][0]}
              />
            )}
          </React.Fragment>
        ) : (
          <Spinner />
        )}
      </React.Fragment>
    );
  }
}

export default ShowDashExample;
