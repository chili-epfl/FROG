// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';
import { omit } from 'lodash';
import { Mongo } from 'meteor/mongo';

import { type ActivityDbT } from 'frog-utils';

import doGetInstances from '../../api/doGetInstances';
import { Sessions } from '../../api/sessions';
import { Objects } from '../../api/objects';
import { DashboardData } from '../../api/activities';
import { activityTypesObj } from '../../activityTypes';
import MultiWrapper from './MultiWrapper';
import dashboardConnect from './dashboardConnection';

type DashboardCompPropsT = {
  activity: ActivityDbT,
  users: { [string]: string },
  instances: Array<string>,
  name: string,
  data?: any
};

export class DashboardComp extends React.Component<
  DashboardCompPropsT,
  { ready: boolean }
> {
  mounted: boolean;
  subscription: any;
  dashboardCollection: any = false;

  constructor(props: DashboardCompPropsT) {
    super(props);
    this.state = { ready: false };
  }

  componentDidMount = () => {
    this.mounted = true;
    if (!this.props.data) {
      dashboardConnect(this.subscribe);
    }
  };

  subscribe = (dashboardCollection: Mongo.Collection, conn?: Object) => {
    this.dashboardCollection = dashboardCollection;
    this.subscription = (conn || Meteor).subscribe(
      'dashboard',
      this.props.activity._id,
      this.props.activity.activityType,
      this.props.name,
      {
        onReady: () => {
          this.setState({ ready: true });
        },
        onStop: err => {
          if (err) {
            console.error('Error on subscribing to dashboard data', err);
          }
        }
      }
    );
  };

  componentWillUnmount = () => {
    if (this.subscription) {
      this.subscription.stop();
    }
  };

  render() {
    if (!this.state.ready && !this.props.data) {
      return <Spinner />;
    }
    const aT = activityTypesObj[this.props.activity.activityType];
    const { users, activity, instances, name } = this.props;
    if (!aT.dashboards || !aT.dashboards[name] || !aT.dashboards[name].Viewer) {
      return <p>The selected activity has no dashboard</p>;
    }
    const Dash = aT.dashboards[name].Viewer;
    const DashWith = this.props.data
      ? props => <Dash state={this.props.data} {...props} />
      : withTracker(() => ({
          state: this.dashboardCollection.findOne(
            this.props.activity._id + '-' + this.props.name
          )
        }))(
          ({ state, ...props }) =>
            state ? <Dash state={omit(state, '_id')} {...props} /> : <Spinner />
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
  const dashboardData = DashboardData.find({}).fetch();
  const users = userList.reduce(
    (acc, u) => ({ ...acc, [u._id]: u.username }),
    {}
  );
  return { users, instances, activity, dashboardData };
})(MultiWrapper);

export class DashboardSubscriptionWrapper extends React.Component<
  {
    activityId: string,
    sessionId: string,
    names?: string[]
  },
  { ready: boolean, activity: any, dashboardData: any }
> {
  subscription: any;

  constructor() {
    super();
    this.state = { ready: false, activity: null, dashboardData: false };
  }

  componentDidMount() {
    const { sessionId, activityId, names } = this.props;
    this.subscription = Meteor.subscribe(
      'dashboard.data',
      sessionId,
      activityId,
      names,
      { onReady: () => this.setState({ ready: true }) }
    );
    Meteor.call('get.activity.for.dashboard', activityId, (err, value) => {
      if (!err) {
        this.setState({
          activity: value.activity
        });
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
