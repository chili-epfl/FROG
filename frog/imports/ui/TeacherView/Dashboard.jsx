// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';

import { withState } from 'recompose';
import { Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';

import { Activities } from '../../api/activities';
import { activityTypesObj } from '../../activityTypes';
import { connection } from '../App/index';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export class DashboardComp extends Component {
  state: { data: any };
  doc: any;
  mounted: boolean;

  constructor(props: Object) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount = () => {
    this.mounted = true;
    this.init(this.props);
  };

  init(props: Object) {
    this.doc =
      this.props.doc ||
      (props.conn || connection).get('rz', 'DASHBOARD//' + props.activity._id);
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
      this.init(nextProps);
    }
  }
  render() {
    const aT = activityTypesObj[this.props.activity.activityType];
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
          data={this.state.data}
          config={this.props.activity.data || this.props.config}
        />
      </div>
    ) : (
      <Spinner />
    );
  }
}

const Dashboard = createContainer(
  ({ session }) => ({
    users: Meteor.users.find({ joinedSessions: session.slug }).fetch()
  }),
  DashboardComp
);

const DashboardNav = ({ activityId, setActivity, openActivities, session }) => {
  const aId =
    activityId || (openActivities.length > 0 && openActivities[0]._id);
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
          {openActivities
            .filter(x => x.dashboard && x.dashboard.Viewer)
            .map(a => (
              <NavItem eventKey={a._id} key={a._id} href="#">
                {a.title}
              </NavItem>
            ))}
        </Nav>
        <Dashboard
          session={session}
          activity={openActivities.find(a => a._id === aId)}
        />
      </Container>
    </div>
  );
};

export default createContainer(
  ({ openActivities }) => ({
    openActivities: Activities.find({ _id: { $in: openActivities } }).fetch()
  }),
  withState('activityId', 'setActivity', null)(DashboardNav)
);
