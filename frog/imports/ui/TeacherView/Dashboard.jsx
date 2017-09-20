// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

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
  timeout: ?number;
  unmounted: boolean;

  constructor(props: Object) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.activity._id !== nextProps.activity._id || !this.doc) {
      if (this.doc) {
        this.doc.destroy();
      }
      this.init(nextProps);
    }
  }

  init(props: Object) {
    if (props.doc) {
      this.doc = props.doc;
      this.update();
      this.doc.on('op', this.update);
    } else {
      this.doc = connection.get('rz', props.activity._id + '//DASHBOARD');
      this.doc.subscribe();
      this.doc.on('ready', this.update);
      this.doc.on('op', this.update);
      this.waitForDoc();
    }
  }

  waitForDoc = () => {
    if (this.doc.type) {
      this.timeout = undefined;
      this.update();
    } else {
      this.timeout = window.setTimeout(this.waitForDoc, 100);
    }
  };

  update = () => {
    if (!this.timeout && !this.unmounted) {
      this.setState({ data: this.doc.data });
    }
  };

  componentWillUnmount = () => {
    if (this.doc) {
      this.doc.destroy();
    }
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.unmounted = true;
  };

  render() {
    const aT = activityTypesObj[this.props.activity.activityType];
    const users = this.props.users
      ? this.props.users.reduce(
          (acc, x) => ({ ...acc, [x._id]: x.username }),
          {}
        )
      : {};

    return aT.dashboard && aT.dashboard.Viewer
      ? <div style={{ width: '100%' }}>
          <aT.dashboard.Viewer users={users} data={this.state.data} />
        </div>
      : <p>The selected activity does not provide a dashboard</p>;
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
          {openActivities.map(a =>
            <NavItem eventKey={a._id} key={a._id} href="#">
              {a.title}
            </NavItem>
          )}
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
