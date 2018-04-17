// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';

import { type ActivityDbT } from 'frog-utils';

import doGetInstances from '../../api/doGetInstances';
import { Sessions } from '../../api/sessions';
import { Objects } from '../../api/objects';
import { activityTypesObj } from '../../activityTypes';
import MultiWrapper from './MultiWrapper';

const Dashboard = new Mongo.Collection('dashboard');

type DashboardCompPropsT = {
  doc?: any,
  activity: ActivityDbT,
  users: { [string | number]: string },
  instances: Array<string | number>,
  name: string
};

export class DashboardComp extends React.Component<
  DashboardCompPropsT,
  { ready: boolean }
> {
  doc: any;
  mounted: boolean;
  subscription: any;

  constructor(props: DashboardCompPropsT) {
    super(props);
    this.state = { ready: false };
  }

  componentDidMount = () => {
    this.mounted = true;
    this.subscription = Meteor.subscribe(
      'dashboard',
      this.props.activity._id,
      this.props.activity.activityType,
      this.props.name,
      { onReady: () => this.setState({ ready: true }) }
    );
  };

  componentWillUnmount = () => {
    this.subscription.stop();
  };

  render() {
    const aT = activityTypesObj[this.props.activity.activityType];
    const { users, activity, instances, name } = this.props;
    if (!aT.dashboards || !aT.dashboards[name] || !aT.dashboards[name].Viewer) {
      return <p>The selected activity has no dashboard</p>;
    }
    const Dash = aT.dashboards[name].Viewer;
    const DashWith = withTracker(() => ({
      state: Dashboard.findOne(this.props.activity._id + '-' + this.props.name)
    }))(
      ({ state, ...props }) =>
        state ? <Dash state={state} {...props} /> : <Spinner />
    );
    DashWith.displayName = 'DashWith';

    return (
      <DashWith
        {...{
          users,
          activity,
          instances,
          config: activity.data
        }}
      />
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
