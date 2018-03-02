// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  type LogDBT,
  A,
  generateReactiveFn,
  uuid,
  ActivityPackageT
} from 'frog-utils';
import { withState, compose } from 'recompose';
import ShareDB from 'sharedb';

import { activityTypesObj } from '../../activityTypes';
import ReactiveHOC from '../StudentView/ReactiveHOC';
import { DashboardComp } from '../TeacherView/Dashboard';

const backend = new ShareDB();
const connection = backend.connect();

type PropsT = { activityType: ActivityPackageT, example: number };

class ShowDashExample extends React.Component<PropsT, any> {
  logs: Object[];
  uuid: string;

  constructor(props: PropsT) {
    super(props);
    this.logs = [];
    this.state = {};
    this.uuid = '1';
    this.fetchLogs();
  }

  fetchLogs = () => {
    Meteor.call(
      'get.example.logs',
      this.props.activityType.id,
      this.props.example,
      (err, succ) => {
        this.logs = succ;
        this.mergeLogs();
      }
    );
  };

  mergeLogs = () => {
    this.activityDbObject = {
      _id: 'preview',
      data: this.props.activityType.examples[0].config,
      groupingKey: 'group',
      plane: 2,
      startTime: 0,
      actualStartingTime: new Date(Date.now()),
      length: 3,
      activityType: this.props.activityType.id
    };
    this.dashboard = connection.get('rz', this.uuid);
    this.dashboard.once('load', () => {
      this.dashboard.create(this.props.activityType.dashboard.initData || {});
      const reactiveDash = generateReactiveFn(dashboard);
      this.logs.forEach(log =>
        this.props.activityType.dashboard.mergeLogs(
          this.dashboard,
          reactiveDash,
          log,
          this.activityDbObject
        )
      );
      this.setState({ ready: true });
    });
  };

  render() {
    return this.state.ready ? (
      <DashboardComp
        activity={this.activityDbObject}
        config={this.props.activityType.examples[0].config}
        doc={this.dashboard}
        instances={[]}
        users={[]}
      />
    ) : null;
  }
}

export default ShowDashExample;
