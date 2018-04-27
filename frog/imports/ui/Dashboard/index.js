// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { omit } from 'lodash';
import { CircularProgress } from 'material-ui/Progress';

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

const RawDashboardComp = ({
  activity,
  users,
  instances,
  name,
  state,
  ready
}) => {
  if (!ready && !state) {
    return <CircularProgress />;
  }
  const aT = activityTypesObj[activity.activityType];
  if (!aT.dashboards || !aT.dashboards[name] || !aT.dashboards[name].Viewer) {
    return <p>The selected activity has no dashboard</p>;
  }
  const Dash = aT.dashboards[name].Viewer;
  return (
    <Dash
      {...{
        state,
        users,
        activity,
        instances,
        config: activity.data
      }}
    />
  );
};

export const DashboardComp = withTracker(props => {
  if (props.data) {
    return { ready: true, state: props.data };
  }
  const [connection, dashboardCollection] = dashboardConnect();
  if (connection === false || connection.status().ready) {
    (connection || Meteor).subscribe(
      'dashboard',
      props.activity._id,
      props.activity.activityType,
      props.name
    );
    const state = dashboardCollection.findOne(
      props.activity._id + '-' + props.name
    );
    if (state)
      return {
        ready: true,
        state: omit(state, '_id')
      };
    else {
      return { ready: false };
    }
  }
})(RawDashboardComp);

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
