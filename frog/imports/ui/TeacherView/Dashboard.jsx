// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';
import { withState } from 'recompose';
import { Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';

import { type ActivityDbT } from 'frog-utils';

import { ErrorBoundary } from '../App/ErrorBoundary';
import doGetInstances from '../../api/doGetInstances';
import { Activities } from '../../api/activities';
import { Sessions } from '../../api/sessions';
import { Objects } from '../../api/objects';
import { activityTypesObj } from '../../activityTypes';
import { connection } from '../App/connection';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

type DashboardCompPropsT = {
  doc?: any,
  activity: ActivityDbT,
  users: { [string | number]: string },
  instances: Array<string | number>,
  config: Object
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
    const _doc = _conn.get('rz', 'DASHBOARD//' + props.activity._id);
    this.doc = this.props.doc || _doc;

    this.doc.setMaxListeners(30);
    this.doc.subscribe();
    if (this.doc.type) {
      this.update();
    } else {
      this.doc.on('load', this.update);
    }
    this.doc.on('op', this.update);
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
    if (this.props.activity._id !== nextProps.activity._id || !this.doc) {
      if (this.doc) {
        this.doc.destroy();
      }
      this.setState({ data: null });
      this.init(nextProps);
    }
  }

  render() {
    const aT = activityTypesObj[this.props.activity.activityType];
    if (!aT.dashboard || !aT.dashboard.Viewer) {
      return <p>The selected activity has no dashboard</p>;
    }
    const { users, activity, instances, config } = this.props;
    return this.state.data ? (
      <div style={{ width: '100%' }}>
        <aT.dashboard.Viewer
          users={users}
          activity={activity}
          instances={instances}
          config={config}
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
  return { users, instances, activity, config: activity.data };
})(DashboardComp);

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

  componentWillUnmountMount() {
    this.subscription.stop();
  }

  render() {
    const { ready, activity } = this.state;
    return (
      ready &&
      activity && (
        <DashboardReactiveWrapper
          activity={activity}
          sessionId={this.props.sessionId}
        />
      )
    );
  }
}

const DashboardNav = props => {
  const { activityId, setActivity, session, activities } = props;
  const { openActivities } = session;
  const acWithDash = activities.filter(ac => {
    const dash = activityTypesObj[ac.activityType].dashboard;
    return dash && dash.Viewer;
  });
  const openAcWithDashIds = acWithDash
    .map(x => x._id)
    .filter(aid => openActivities && openActivities.includes(aid));
  const aId = activityId || openAcWithDashIds.find(() => true);
  const activityToDash = activities.find(a => a._id === aId);
  return (
    <div>
      <h1>Dashboards</h1>
      <Container>
        <Nav
          bsStyle="pills"
          stacked
          activeKey={aId}
          onSelect={a => setActivity(a)}
          style={{ width: '150px' }}
        >
          {acWithDash.map(a => (
            <NavItem eventKey={a._id} key={a._id} href="#">
              {a.title}
              {session.openActivities.includes(a._id) ? ' (open)' : ''}
            </NavItem>
          ))}
        </Nav>
        {activityToDash && (
          <ErrorBoundary msg="Dashboard crashed, try reloading">
            <DashboardReactiveWrapper
              sessionId={session._id}
              activity={activityToDash}
            />
          </ErrorBoundary>
        )}
      </Container>
    </div>
  );
};

export default withTracker(({ session }) => ({
  activities: Activities.find({ graphId: session.graphId }).fetch()
}))(withState('activityId', 'setActivity', null)(DashboardNav));
