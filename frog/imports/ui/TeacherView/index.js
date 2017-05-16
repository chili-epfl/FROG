// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import StudentList from './StudentList';
import ActivityList from './ActivityList';
import ButtonList from './ButtonList';
import SessionList from './SessionList';

import { Sessions } from '../../api/sessions';
import { Activities } from '../../api/activities';
import { Graphs } from '../../api/graphs';
import { Logs } from '../../api/logs';

import { activityTypesObj } from '../../activityTypes';

const displaySession = session =>
  ({
    CREATED: 'Not started',
    STARTED: 'Control activities',
    PAUSED: 'Paused',
    STOPPED: 'Stopped'
  }[session.state]);

const SessionController = ({ session, activities }) => (
  <div>
    {session
      ? <div>
          <div style={{ float: 'right' }}>
            <div style={{ marginLeft: '10px', float: 'right' }}>
              <ButtonList session={session} />
            </div>
            {displaySession(session)}
          </div>
          <ActivityList activities={activities} session={session} />
        </div>
      : <p>Create or select a session from the list bellow</p>}
  </div>
);

const Dashboard = ({ logs, activity }) => {
  let Dash = <p>NO DASHBOARD</p>;
  if (activity) {
    const activityType = activityTypesObj[activity.activityType];
    if (activityType && activityType.Dashboard) {
      Dash = (
        <div>
          <activityType.Dashboard logs={logs} />
        </div>
      );
    }
  }
  return (
    <div id="dashboard">
      <h1>Dashboard</h1>
      {Dash}
    </div>
  );
};

const DashView = createContainer(
  ({ session }) => ({
    activity: session && Activities.findOne(session.activityId),
    logs: session && Logs.find({ activityId: session.activityId }).fetch()
  }),
  Dashboard
);

const LogView = ({ logs }) => (
  <div>
    <h1>Logs</h1>
    {logs.length
      ? <ul>
          {logs.map(log => (
            <pre key={log._id}>{JSON.stringify(log, null, 2)}</pre>
          ))}
        </ul>
      : <p>NO LOGS</p>}
  </div>
);

export default createContainer(
  () => {
    const user = Meteor.users.findOne(Meteor.userId());

    const session = user.profile
      ? Sessions.findOne(user.profile.controlSession)
      : null;

    const logs = session ? Logs.find({ sessionId: session._id }).fetch() : [];

    const activities = session
      ? Activities.find({ sessionId: session._id }).fetch()
      : null;

    const students = session
      ? Meteor.users.find({ 'profile.currentSession': session._id }).fetch()
      : null;

    return {
      sessions: Sessions.find().fetch(),
      session,
      graphs: Graphs.find().fetch(),
      activities,
      students,
      logs,
      user
    };
  },
  props => (
    <div id="teacher">
      <SessionController {...props} />
      <DashView {...props} />
      <StudentList students={props.students} />
      <LogView {...props} />
      <SessionList {...props} />
    </div>
  )
);
