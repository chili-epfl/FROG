// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Inspector } from 'react-inspector';
import { withVisibility, A } from 'frog-utils';

import StudentList from './StudentList';
import ButtonList from './ButtonList';
import SessionList from './SessionList';
import GraphView from './GraphView';
import { Sessions } from '../../api/sessions';
import { Activities } from '../../api/activities';
import { Graphs } from '../../api/graphs';
import { Logs, flushLogs } from '../../api/logs';
import { activityTypesObj } from '../../activityTypes';

const rawSessionController = ({
  session,
  visible,
  toggleVisibility,
  logs,
  currentTime,
}) =>
  <div>
    {session
      ? <div>
          <ButtonList
            session={session}
            toggle={toggleVisibility}
            currentTime={currentTime}
          />
          {visible
            ? <DashView logs={logs} session={session} />
            : <GraphView session={session} />}
        </div>
      : <p>Create or select a session from the list below</p>}
  </div>;

const SessionController = withVisibility(rawSessionController);
SessionController.displayName = 'SessionController';

const Dashboard = ({ logs, activities }) => {
  let Dash = <p>NO DASHBOARD</p>;
  if (activities) {
    Dash = activities.map(a => {
      const activityType = activityTypesObj[a.activityType];
      if (activityType && activityType.Dashboard) {
        return (
          <activityType.Dashboard
            logs={logs.filter(x => x.activity === a._id)}
            key={a._id}
          />
        );
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
      .reduce(
        (acc, x) => [...acc, ...(Logs.find({ activity: x }).fetch() || [])],
        [],
      ),
  }),
  Dashboard,
);

const LogView = withVisibility(({ logs, toggleVisibility, visible }) => {
  if (!logs || logs.length < 1) {
    return null;
  }

  return (
    <div>
      <span role="button" tabIndex={0} onClick={toggleVisibility}>
        <h1>
          Logs {!visible && '...'}
        </h1>
      </span>
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
                  borderBottomWidth: '2px',
                }}
              >
                <Inspector data={log} expandLevel={2} />
              </div>,
            )}
          </ul>
        </div>}
    </div>
  );
});

LogView.displayName = 'LogView';

const TeacherView = createContainer(
  () => {
    const user = Meteor.users.findOne(Meteor.userId());
    const session =
      user.profile && Sessions.findOne(user.profile.controlSession);
    const logs = session
      ? Logs.find({}, { sort: { createdAt: -1 } }, { limit: 10 }).fetch()
      : [];
    const activities =
      session && Activities.find({ graphId: session.graphId }).fetch();
    const students =
      session &&
      Meteor.users.find({ 'profile.currentSession': session._id }).fetch();
    const currentTime = TimeSync.serverTime();

    return {
      sessions: Sessions.find().fetch(),
      session,
      graphs: Graphs.find({ broken: { $ne: true } }).fetch(),
      activities,
      students,
      logs,
      user,
      currentTime,
    };
  },
  props =>
    <div id="teacher" style={{ display: 'flex' }}>
      <div style={{ width: '80%' }}>
        <SessionController {...props} />
        <hr />
        <StudentList students={props.students} />
        <hr />
        <SessionList {...props} />
      </div>
      <div>
        <LogView {...props} />
      </div>
    </div>,
);

TeacherView.displayName = 'TeacherView';
export default TeacherView;
