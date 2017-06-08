// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import JSONTree from 'react-json-tree';

import StudentList from './StudentList';
import ActivityList from './ActivityList';
import ButtonList from './ButtonList';
import SessionList from './SessionList';
import GraphView from './GraphView';

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

const SessionController = ({ session, activities }) =>
  <div>
    {session
      ? <div>
          <p>{displaySession(session) + ': ' + session._id}</p>
          <ButtonList session={session} />
          <GraphView session={session} />
          <ActivityList activities={activities} />
        </div>
      : <p>Create or select a session from the list bellow</p>}
  </div>;

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

const LogView = ({ logs }) =>
  <div>
    <h1>Logs</h1>
    {logs.length
      ? <ul>
          {logs
            .sort((x, y) => y.createdAt - x.createdAt)
            .map(log =>
              <JSONTree key={log._id} data={log} theme="solarized" />
            )}
        </ul>
      : <p>NO LOGS</p>}
  </div>;

export default createContainer(
  () => {
    const user = Meteor.users.findOne(Meteor.userId());
    const session =
      user.profile && Sessions.findOne(user.profile.controlSession);
    const logs = session
      ? Logs.find({}, { sort: { createdAt: -1 }, limit: 10 }).fetch()
      : [];
    const activities =
      session && Activities.find({ graphId: session.graphId }).fetch();
    const students =
      session &&
      Meteor.users.find({ 'profile.currentSession': session._id }).fetch();

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
  props =>
    <div id="teacher" style={{ display: 'flex' }}>
      <div>
        <SessionController {...props} />
        <SessionList {...props} />
        <StudentList students={props.students} />
      </div>
      <div>
        <LogView {...props} />
      </div>
    </div>
);
