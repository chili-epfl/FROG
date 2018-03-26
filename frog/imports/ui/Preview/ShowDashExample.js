// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { type ActivityPackageT } from 'frog-utils';
import { throttle } from 'lodash';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Inspector from 'react-inspector';

import {
  DashPreviewWrapper,
  mergeData,
  initDocuments
} from './dashboardInPreviewAPI';

type PropsT = {
  activityType: ActivityPackageT,
  example: number,
  showLogs: boolean
};

type StateT = {
  ready: boolean,
  logs: Object[]
};

class ShowDashExample extends React.Component<PropsT, StateT> {
  activityDbObject: Object;

  constructor(props: PropsT) {
    super(props);
    this.state = { ready: false, logs: [] };
    this.fetchLogs();
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
    initDocuments(aT, true);
    this.state.logs.slice(0, e).forEach(log => mergeData(aT, log, config));
  };

  render() {
    // const instances = this.props.activityType.dashboard.exampleLogs[
    //   this.props.example
    // ].instances || []
    const instances = [];
    const users = {};
    const { logs } = this.state;
    return (
      <React.Fragment>
        <Slider
          defaultValue={500}
          min={0}
          max={logs.length}
          onChange={throttle(this.displaySubset, 2000, { leading: false })}
        />
        {this.props.showLogs ? (
          <Inspector data={this.state.logs} />
        ) : (
          <DashPreviewWrapper
            activity={this.activityDbObject}
            config={this.activityDbObject.data}
            instances={instances}
            users={users}
            activityType={this.props.activityType}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ShowDashExample;
