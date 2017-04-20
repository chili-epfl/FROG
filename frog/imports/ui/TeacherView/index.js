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

const DisplaySession = ({ session }) =>
  ({
    CREATED: (
      <p>
        You have created the session and can wait for your students to join it before starting it
      </p>
    ),
    STARTED: <p>The session is started, you can run the activities</p>,
    PAUSED: <p>The session is paused, you can restart it at any time</p>,
    STOPPED: <p>The session has been stopped</p>
  }[session.state]);

const SessionController = ({ session, activities, students }) => (
  <div>
    <h1>Session control</h1>
    {session
      ? <div>
          <DisplaySession session={session} />
          <ButtonList session={session} />
          <StudentList students={students} />
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
    <div>
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
    <div>
      <SessionController {...props} />
      <DashView {...props} />
      <SessionList {...props} />
      <LogView {...props} />
    </div>
  )
);
