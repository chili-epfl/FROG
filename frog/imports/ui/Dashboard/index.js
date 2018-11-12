// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { DDP } from 'meteor/ddp-client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { type ActivityDbT, generateReactiveFn } from 'frog-utils';

import doGetInstances from '../../api/doGetInstances';
import { Sessions } from '../../api/sessions';
import { Objects } from '../../api/objects';
import { DashboardData } from '../../api/activities';
import { activityTypesObj } from '../../activityTypes';
import MultiWrapper from './MultiWrapper';
import { connection as conn } from '../App/connection';
import LearningItem from '../LearningItem';

let connection = null;
let dashboardCollection = null;

type DashboardCompPropsT = {
  activity: ActivityDbT,
  users: { [string]: string },
  instances: Array<string>,
  name: string,
  state?: any,
  ready: boolean,
  config?: Object,
  object: Object
};

const RawDashboardComp = ({
  activity,
  users,
  instances,
  name,
  state,
  ready,
  object
}: DashboardCompPropsT) => {
  if (!ready && !state) {
    return <CircularProgress />;
  }
  const aT = activityTypesObj[activity.activityType];
  const doc = conn.get('li', 'bookmark');
  const dataFn = generateReactiveFn(doc, LearningItem);
  if (!aT.dashboards || !aT.dashboards[name] || !aT.dashboards[name].Viewer) {
    return <p>The selected activity has no dashboard</p>;
  }
  const Dash = aT.dashboards[name].Viewer;
  return state ? (
    <Dash
      {...{
        state,
        users,
        activity,
        instances,
        object,
        LearningItem: dataFn.LearningItem
      }}
    />
  ) : null;
};

export const DashboardComp = withTracker(props => {
  if (props.data) {
    return { ready: true, state: props.data };
  }
  if (!Meteor.settings.public.dashboard_server_url) {
    if (!dashboardCollection) {
      dashboardCollection = new Mongo.Collection('dashboard');
    }
    connection = false;
  }
  if (connection === null) {
    connection = DDP.connect(Meteor.settings.public.dashboard_server_url);
    dashboardCollection = new Mongo.Collection('dashboard', connection);
  }
  if (connection === false || connection.status().connected) {
    (connection || Meteor).subscribe(
      'dashboard',
      props.activity._id,
      props.activity.activityType,
      props.name,
      props.config
    );
    const state =
      dashboardCollection &&
      dashboardCollection.findOne(props.activity._id + '-' + props.name);
    if (state) {
      return {
        ready: true,
        state: state.data
      };
    } else {
      return { ready: false };
    }
  } else {
    return { ready: false };
  }
})(RawDashboardComp);

export const DashboardReactiveWrapper = withTracker(props => {
  const { activity, names, sessionId } = props;
  const subscription = Meteor.subscribe(
    'dashboard.data',
    sessionId,
    activity._id,
    names
  );
  const session = Sessions.findOne(sessionId);
  const object = Objects.findOne(activity._id);
  if (!subscription.ready() || !object) {
    return { ready: false };
  }
  const instances = object && doGetInstances(activity, object).groups;
  const dashboardData = DashboardData.find({}).fetch();
  const users = object.globalStructure.students;
  return {
    ready: subscription.ready() && session && activity && object,
    instances,
    object,
    activity,
    dashboardData,
    session,
    users
  };
})(MultiWrapper);

DashboardReactiveWrapper.displayName = 'DashboardReactiveWrapper';

export class DashboardSubscriptionWrapper extends React.Component<
  {
    activityId: string
  },
  { activity: any }
> {
  subscription: any;
  constructor() {
    super();
    this.state = { activity: null };
  }

  componentDidMount() {
    const { activityId } = this.props;
    Meteor.call('get.activity.for.dashboard', activityId, (err, value) => {
      if (err) {
        console.error('Error getting activity for dashboard', activityId, err);
      }
      if (!err) {
        this.setState({
          activity: value.activity
        });
      }
    });
  }

  render() {
    const { activity } = this.state;
    return (
      activity && (
        <DashboardReactiveWrapper activity={activity} {...this.props} />
      )
    );
  }
}
