// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { DDP } from 'meteor/ddp-client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { type ActivityDbT } from '/imports/frog-utils';

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
  sessionId,
  users,
  instances,
  name,
  state,
  ready,
  object
}: DashboardCompPropsT) => {
  if (name === 'Content') {
    return <LIDashboard activityId={activity._id} />;
  }
  if (!ready && !state) {
    return <CircularProgress />;
  }
  const aT = activityTypesObj[activity.activityType];
  const doc = conn.get('li', 'bookmark');
  const dataFn = generateReactiveFn(doc, LearningItem);

  const session = Sessions.findOne(sessionId);
  const slug = session.slug;

  if (!aT.dashboards || !aT.dashboards[name] || !aT.dashboards[name].Viewer) {
    return <p>The selected activity has no dashboard</p>;
  }
  const Dash = aT.dashboards[name].Viewer;
  // where sendMsg is defined (called from)
  console.log("uniqueID " + activity.data.uniqueId);
  console.log('slug: ' + slug);
  return state ? (
    <Dash
      state={state}
      users={users}
      activity={activity}
      instances={instances}
      object={object}
      sendActMsg={msg => Meteor.call('ws.send', activity.data.uniqueId, msg)}
      sendSesMsg={msg => Meteor.call('ws.send', slug, msg)}
      LearningItem={dataFn.LearningItem}
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
})(e => <MultiWrapper {...e} />);
// above, it should have been enough to only have MultiWrapper instead of the function wrapper, but
// that began giving me React component type errors - returns Object. This seems to work for now.

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
        // $FlowFixMe
        <DashboardReactiveWrapper activity={activity} {...this.props} />
      )
    );
  }
}
