// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { generateReactiveFn, uuid, ActivityPackageT } from 'frog-utils';
import { cloneDeep, throttle } from 'lodash';
import ShareDB from 'sharedb';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Spinner from 'react-spinner';
import Inspector from 'react-inspector';

import { DashboardComp } from '../TeacherView/Dashboard';

const backend = new ShareDB();
const connection = backend.connect();

type PropsT = {
  activityType: ActivityPackageT,
  example: number,
  showLogs?: boolean
};

class ShowDashExample extends React.Component<
  PropsT,
  { ready: boolean, uuid: string, display: number }
> {
  logs: Object[];
  activityDbObject: Object;
  dashboard: any;
  reactiveDash: any;

  constructor(props: PropsT) {
    super(props);
    this.logs = [];
    this.state = { ready: false, uuid: uuid(), display: 0 };
    this.fetchLogs();
  }

  componentWillReceiveProps(nextProps: PropsT) {
    this.setState({ uuid: uuid() }, () => this.fetchLogs(nextProps));
  }

  fetchLogs = (props: PropsT = this.props) => {
    this.activityDbObject = {
      ...{
        _id: 'preview',
        data: this.props.activityType.meta.exampleData[0].config,
        groupingKey: 'group',
        plane: 2,
        startTime: 0,
        actualStartingTime: new Date(Date.now()),
        length: 3,
        activityType: this.props.activityType.id
      },
      ...this.props.activityType.dashboard.exampleLogs[this.props.example]
        .activityMerge
    };
    this.dashboard = null;
    this.dashboard = connection.get('rz', this.state.uuid);
    this.dashboard.subscribe();
    this.dashboard.once('load', () => {
      this.dashboard.create(
        cloneDeep(this.props.activityType.dashboard.initData) || {}
      );
      this.reactiveDash = generateReactiveFn(this.dashboard);

      Meteor.call(
        'get.example.logs',
        props.activityType.id,
        props.example,
        (err, succ) => {
          if (err) {
            console.error('Error fetching logs', err);
          }
          this.logs = succ;
          this.mergeLogs();
        }
      );
    });
  };

  mergeLogs = (max: number = 999999) => {
    const mergeLog = this.props.activityType.dashboard.mergeLog;
    const dashboard = this.dashboard;
    const reactiveDash = this.reactiveDash;
    const activityDbObject = this.activityDbObject;
    this.logs.slice(0, max).forEach(log => {
      mergeLog(dashboard.data, reactiveDash, log, activityDbObject);
    });
    this.setState({ ready: true, display: Math.min(max, this.logs.length) });
  };

  displaySubset = (e: number) => {
    this.setState({ uuid: uuid(), ready: false }, () => {
      this.dashboard = null;
      this.dashboard = connection.get('rz', this.state.uuid);
      this.dashboard.subscribe();
      this.dashboard.once('load', () => {
        this.dashboard.create(
          cloneDeep(this.props.activityType.dashboard.initData) || {}
        );
        this.reactiveDash = generateReactiveFn(this.dashboard);
        this.mergeLogs(e);
      });
    });
  };

  render() {
    return (
      <div>
        {this.state.ready ? (
          <React.Fragment>
            <Slider
              defaultValue={this.state.display}
              min={0}
              max={this.logs.length}
              onChange={throttle(this.displaySubset, 2000, { leading: false })}
            />
            {this.props.showLogs ? (
              <Inspector data={this.dashboard.data} />
            ) : (
              <DashboardComp
                activity={this.activityDbObject}
                config={this.props.activityType.meta.exampleData[0].config}
                doc={this.dashboard}
                instances={Array(
                  this.props.activityType.dashboard.exampleLogs[
                    this.props.example
                  ].instances || []
                ).fill('')}
                users={{}}
              />
            )}
          </React.Fragment>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default ShowDashExample;
