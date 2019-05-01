// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { DDP } from 'meteor/ddp-client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { type ActivityDbT } from 'frog-utils';

import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import doGetInstances from '/imports/api/doGetInstances';
import { Sessions } from '/imports/api/sessions';
import { Objects } from '/imports/api/objects';
import { DashboardData } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';
import LearningItem from '/imports/client/LearningItem';
import { connection as conn } from '../App/connection';
import MultiWrapper from './MultiWrapper';
import LIDashboard from './LIDashboard';

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
  if (name === 'Learning Items') {
    return <LIDashboard activityId={activity._id} />;
  }
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
  if (props.name === 'Learning Items') {
    return {};
  }
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
console.log('withtracker')
console.log(MultiWrapper)
  const { activity, names, sessionId } = props;
  const subscription = Meteor.subscribe(
    'dashboard.data',
    sessionId,
    activity._id,
    names
  );
    console.log('1')
  const session = Sessions.findOne(sessionId);
    console.log('2')
  const object = Objects.findOne(activity._id);
    console.log('3')
  if (!subscription.ready() || !object) {
    console.log('notready')
    return { ready: false };
  }
    console.log('4')
  const instances = object && doGetInstances(activity, object).groups;
    console.log('5')
  const dashboardData = DashboardData.find({}).fetch();
    console.log('6')
  const users = object.globalStructure.students;
  console.log( {
    ready: subscription.ready() && session && activity && object,
    instances,
    object,
    activity,
    dashboardData,
    session,
    users
  });
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
