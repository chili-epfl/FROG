// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Inspector } from 'react-inspector';
import { withVisibility, A } from 'frog-utils';

import StudentList from './StudentList';
import ActivityList from './ActivityList';
import ButtonList from './ButtonList';
import SessionList from './SessionList';
import GraphView from './GraphView';

import { Sessions } from '../../api/sessions';
import { Activities } from '../../api/activities';
import { Graphs } from '../../api/graphs';
import { Logs, flushLogs } from '../../api/logs';

import { activityTypesObj } from '../../activityTypes';

const displaySession = session =>
  ({
    CREATED: 'Not started',
    STARTED: 'Control activities',
    PAUSED: 'Paused',
    STOPPED: 'Stopped'
  }[session.state]);

const rawSessionController = ({
  session,
  activities,
  visible,
  toggleVisibility
}) =>
  <div>
    {session
      ? <div>
          <ButtonList session={session} toggle={toggleVisibility} />
          {visible
            ? <DashView session={session} />
            : <GraphView session={session} />}
          <ActivityList activities={activities} />
        </div>
      : <p>Create or select a session from the list below</p>}
  </div>;

const SessionController = withVisibility(rawSessionController);

const Dashboard = ({ logs, activities }) => {
  let Dash = <p>NO DASHBOARD</p>;
  if (activities) {
    Dash = activities.map((a, i) => {
      const activityType = activityTypesObj[a.activityType];
      console.log('rendering', activityType, logs[i]);
      if (activityType && activityType.Dashboard) {
        return <activityType.Dashboard logs={logs[i]} key={a._id} />;
      } else {
        return null;
      }
    });
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
    activities: (session.openActivities || []).map(x => Activities.findOne(x)),
    logs: (session.openActivities || [])
      .map(x => Logs.find({ activityId: x }).fetch() || [])
  }),
  Dashboard
);

const LogView = withVisibility(({ logs, toggleVisibility, visible }) => {
  if (!logs || logs.length < 1) {
    return null;
  }

  return (
    <div>
      <h1 onClick={toggleVisibility}>Logs {!visible && '...'}</h1>
      {visible &&
        <div>
          <A onClick={flushLogs}>Flush logs</A>
          <ul>
            {logs.sort((x, y) => y.createdAt - x.createdAt).map(log =>
              <div
                key={log._id}
                style={{
                  marginBottom: '40px',
                  borderBottomStyle: 'dashed',
                  borderBottomWidth: '2px'
                }}
              >
                <Inspector data={log} expandLevel={2} />
              </div>
            )}
          </ul>
        </div>}
    </div>
  );
});

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
        <hr />
        <StudentList students={props.students} />
        <hr />
        <SessionList {...props} />
      </div>
      <div>
        <LogView {...props} />
      </div>
    </div>
);
