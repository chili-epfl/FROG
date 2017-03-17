// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import {
  Sessions,
  addSession,
  removeSession,
  updateSessionState,
  setTeacherSession
} from '../api/sessions';
import { Activities } from '../api/activities';
import { Graphs } from '../api/graphs';
import { Logs } from '../api/logs';
import { runSession, nextActivity } from '../api/engine';

import { activityTypesObj } from '../activityTypes';

const StudentList = ({ students }) => (
  <div>
    <h3>Registered students</h3>
    {students && students.length
      ? <ul>
          {students.map(student => (
            <li key={student._id}>{student.username}</li>
          ))}
        </ul>
      : <p>NO STUDENTS</p>}
  </div>
);

const ActivityList = ({ activities, session }) => (
  <div>
    <h3>Available Activities</h3>
    {activities && activities.length
      ? <ul>
          {activities.map(activity => (
            <li key={activity._id}>
              {activity.title} - <i>{activity.activityType}</i>
              {activity._id === session.activityId ? ' (running)' : ''}
            </li>
          ))}
        </ul>
      : <p>NO ACTIVITY</p>}
  </div>
);

const Buttons = ({ session }) => {
  const buttons = [
    {
      states: ['CREATED'],
      type: 'primary',
      onClick: () => runSession(session._id),
      text: 'Start'
    },
    {
      states: ['STARTED'],
      type: 'primary',
      onClick: () => nextActivity(session._id),
      text: 'Next Activity'
    },
    {
      states: ['STARTED'],
      type: 'warning',
      onClick: () => updateSessionState(session._id, 'PAUSED'),
      text: 'Pause'
    },
    {
      states: ['PAUSED', 'STOPPED'],
      type: 'primary',
      onClick: () => updateSessionState(session._id, 'STARTED'),
      text: 'Restart'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => updateSessionState(session._id, 'STOPPED'),
      text: 'Stop'
    },
    {
      states: ['STOPPED'],
      type: 'danger',
      onClick: () => removeSession(session._id),
      text: 'Delete'
    }
  ];
  return (
    <div>
      {buttons
        .filter(button => button.states.indexOf(session.state) > -1)
        .map(button => (
          <button
            key={button.text}
            className={'btn btn-' + button.type + ' btn-sm'}
            onClick={button.onClick}
          >
            {button.text}
          </button>
        ))}
    </div>
  );
};

const DisplaySession = ({ session }) => ({
  CREATED: (
    <p>
      You have created the session and can wait for your students to join it before starting it
    </p>
  ),
  STARTED: <p>The session is started, you can run the activities</p>,
  PAUSED: <p>The session is paused, you can restart it at any time</p>,
  STOPPED: <p>The session has been stopped</p>
})[session.state];

const SessionController = ({ session, activities, students }) => (
  <div>
    <h1>Session control</h1>
    {session
      ? <div>
          <DisplaySession session={session} />
          <Buttons session={session} />
          <StudentList students={students} />
          <ActivityList activities={activities} session={session} />
        </div>
      : <p>Create or select a session from the list bellow</p>}
  </div>
);

class SessionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphId: this.props.graphs[0] ? this.props.graphs[0]._id : null
    };
  }

  changeGraph = event => {
    event.preventDefault();
    this.setState({ graphId: event.target.value });
  };

  submitAddSession = event => {
    event.preventDefault();
    addSession(this.state.graphId);
  };

  render() {
    return (
      <div>
        <h1>Session list</h1>
        <select onChange={this.changeGraph}>
          {this.props.graphs.map(graph => (
            <option key={graph._id} value={graph._id}>{graph.name}</option>
          ))}
        </select>
        <button
          className="btn btn-primary btn-sm"
          onClick={this.submitAddSession}
        >
          Add session
        </button>
        <ul>
          {this.props.sessions.map(session => (
            <li key={session._id}>
              <a href="#" onClick={() => setTeacherSession(session._id)}>
                {session._id}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const DashView = ({ logs, session }) => {
  let Dash = <p>NO DASHBOARD</p>;
  if (session) {
    const activity = Activities.findOne({ _id: session.activity });
    if (activity) {
      const activityType = activityTypesObj[activity.activityType];
      const specificLogs = logs.filter(log => log.activity === activity._id);
      if (activityType && activityType.Dashboard) {
        Dash = (
          <div>
            <p>The current time is {activityType.Dashboard.timeNow}</p>
            <activityType.Dashboard logs={specificLogs} />
          </div>
        );
      }
    }
  }
  return (
    <div>
      <h1>Dashboard</h1>
      {Dash}
    </div>
  );
};

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
    const user = Meteor.users.findOne({ _id: Meteor.userId() });

    const session = user.profile
      ? Sessions.findOne({ _id: user.profile.controlSession })
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
