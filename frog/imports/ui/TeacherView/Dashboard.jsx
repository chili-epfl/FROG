// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';
import { withState } from 'recompose';
import { Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';

import { type ActivityDbT } from 'frog-utils';

import doGetInstances from '../../api/doGetInstances';
import { Activities } from '../../api/activities';
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
  users: Array<{ _id: string | number, username: string }>,
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
      return null;
    }

    const users = this.props.users
      ? this.props.users.reduce(
          (acc, x) => ({ ...acc, [x._id]: x.username }),
          {}
        )
      : {};

    return this.state.data !== null ? (
      <div style={{ width: '100%' }}>
        <aT.dashboard.Viewer
          users={users}
          activity={this.props.activity}
          instances={this.props.instances || []}
          data={this.state.data}
          config={this.props.activity.data || this.props.config}
        />
      </div>
    ) : (
      <Spinner />
    );
  }
}

export const Dashboard = withTracker(({ session, activity }) => {
  const object = Objects.findOne(activity._id);
  const instances = doGetInstances(activity, object).groups;
  return {
    users: Meteor.users.find({ joinedSessions: session.slug }).fetch(),
    instances
  };
})(DashboardComp);

const DashboardNav = ({ activityId, setActivity, openActivities, session }) => {
  const relevantActivities = openActivities.filter(
    x =>
      activityTypesObj[x.activityType].dashboard &&
      activityTypesObj[x.activityType].dashboard.Viewer
  );
  const aId =
    activityId || (relevantActivities.length > 0 && relevantActivities[0]._id);
  if (!aId) {
    return null;
  }
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
          {relevantActivities.map(a => (
            <NavItem eventKey={a._id} key={a._id} href="#">
              {a.title}
            </NavItem>
          ))}
        </Nav>
        {aId && (
          <Dashboard
            session={session}
            activity={openActivities.find(a => a._id === aId)}
          />
        )}
      </Container>
    </div>
  );
};

export default withTracker(({ openActivities }) => ({
  openActivities: Activities.find({ _id: { $in: openActivities } }).fetch()
}))(withState('activityId', 'setActivity', null)(DashboardNav));
