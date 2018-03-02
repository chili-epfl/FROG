// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { generateReactiveFn, uuid, ActivityPackageT } from 'frog-utils';
import { cloneDeep } from 'lodash';
import ShareDB from 'sharedb';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

import { DashboardComp } from '../TeacherView/Dashboard';

const backend = new ShareDB();
const connection = backend.connect();

type PropsT = { activityType: ActivityPackageT, example: number };

class ShowDashExample extends React.Component<
  PropsT,
  { ready: boolean, uuid: string }
> {
  logs: Object[];
  activityDbObject: Object;
  dashboard: any;
  reactiveDash: any;

  constructor(props: PropsT) {
    super(props);
    this.logs = [];
    this.state = { ready: false, uuid: uuid() };
    this.fetchLogs();
  }

  componentWillReceiveProps(nextProps: PropsT) {
    this.setState({ uuid: uuid(), ready: false }, () =>
      this.fetchLogs(nextProps)
    );
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
          this.logs = succ;
          this.mergeLogs();
        }
      );
    });
  };

  mergeLogs = () => {
    console.log('merge logs');
    const mergeLog = this.props.activityType.dashboard.mergeLog;
    const dashboard = this.dashboard;
    const reactiveDash = this.reactiveDash;
    const activityDbObject = this.activityDbObject;
    console.time('foreach');
    this.logs.forEach(log => {
      mergeLog(dashboard.data, reactiveDash, log, activityDbObject);
    });
    console.timeEnd('foreach');
    this.setState({ ready: true });
  };

  render() {
    return this.state.ready ? (
      <div>
        <Slider min={0} max={5} onChange={e => console.log(e)} />
        <DashboardComp
          activity={this.activityDbObject}
          config={this.props.activityType.meta.exampleData[0].config}
          doc={this.dashboard}
          instances={Array(
            this.props.activityType.dashboard.exampleLogs[this.props.example]
              .instances || []
          ).fill('')}
          users={{}}
        />
      </div>
    ) : null;
  }
}

export default ShowDashExample;
