// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';
import _ from 'lodash';

import { type ActivityDbT } from 'frog-utils';

import doGetInstances from '../../api/doGetInstances';
import { Sessions } from '../../api/sessions';
import { Objects } from '../../api/objects';
import { dashDocId } from '../../api/logs';
import { activityTypesObj } from '../../activityTypes';
import { connection } from '../App/connection';
import MultiWrapper from './MultiWrapper';

type DashboardCompPropsT = {
  doc?: any,
  activity: ActivityDbT,
  users: { [string | number]: string },
  instances: Array<string | number>,
  name: string
};

export class DashboardComp extends React.Component<
  DashboardCompPropsT,
  { data: any }
> {
  doc: any;
  mounted: boolean;

  constructor(props: DashboardCompPropsT) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount = () => {
    this.mounted = true;
    this.init(this.props);
  };

  init(props: Object) {
    const _conn = props.conn || connection || {};
    const reactiveName = dashDocId(props.activity._id, props.name);
    if (props.doc) {
      this.doc = props.doc;
      this.update();
    } else {
      _conn.get('rz', reactiveName);
      this.doc.setMaxListeners(30);
      this.doc.subscribe();
      if (this.doc.type) {
        this.update();
      } else {
        this.doc.on('load', this.update);
      }
      this.doc.on('op', this.update);
    }
  }

  update = () => {
    if (this.mounted) {
      this.setState({ data: this.doc.data });
    }
  };

  componentWillUnmount = () => {
    this.doc.removeListener('op', this.update);
    this.doc.removeListener('load', this.update);
    this.mounted = false;
  };

  componentWillReceiveProps(nextProps: Object) {
    if (
      this.props.activity._id !== nextProps.activity._id ||
      !this.doc ||
      this.props.name !== nextProps.name ||
      this.props.doc !== nextProps.doc
    ) {
      if (this.doc) {
        this.doc.destroy();
      }
      this.setState({ data: null });
      this.init(nextProps);
    }
  }

  render() {
    const aT = activityTypesObj[this.props.activity.activityType];
    const { users, activity, instances, name } = this.props;
    if (!aT.dashboard || !aT.dashboard[name] || !aT.dashboard[name].Viewer) {
      return <p>The selected activity has no dashboard</p>;
    }
    const Viewer = aT.dashboard[name].Viewer;
    return this.state.data ? (
      <div style={{ width: '100%' }}>
        <Viewer
          users={users}
          activity={activity}
          instances={instances}
          config={activity.data}
          data={this.state.data}
        />
      </div>
    ) : (
      <Spinner />
    );
  }
}

// This reactive wrapper works only when logged in as the teacher
export const DashboardReactiveWrapper = withTracker(props => {
  const { activity, sessionId } = props;
  const session = Sessions.findOne(sessionId);
  const object = Objects.findOne(activity._id);
  const instances = doGetInstances(activity, object).groups;
  const userList = Meteor.users.find({ joinedSessions: session.slug }).fetch();
  const users = userList.reduce(
    (acc, u) => ({ ...acc, [u._id]: u.username }),
    {}
  );
  return { users, instances, activity };
})(MultiWrapper);

export class DashboardSubscriptionWrapper extends React.Component<
  *,
  { ready: boolean, activity: any }
> {
  subscription: any;

  constructor() {
    super();
    this.state = { ready: false, activity: null };
  }

  componentDidMount() {
    const { sessionId, activityId } = this.props;
    this.subscription = Meteor.subscribe(
      'dashboard.data',
      sessionId,
      activityId,
      { onReady: () => this.setState({ ready: true }) }
    );
    Meteor.call('get.activity.for.dashboard', activityId, (err, value) => {
      if (!err) {
        this.setState({ activity: value.activity });
      }
    });
  }

  componentWillUnmount() {
    this.subscription.stop();
  }

  render() {
    const { ready, activity } = this.state;
    return (
      ready &&
      activity && (
        <DashboardReactiveWrapper activity={activity} {...this.props} />
      )
    );
  }
}
