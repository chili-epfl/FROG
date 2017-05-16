import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Sessions, setStudentSession } from '../../api/sessions';

import Runner from './Runner.jsx';

const SessionList = ({ sessions, curSessionId }) => (
  <div>
    <h3>Session list</h3>
    <ul>
      {sessions.filter(_ => _.state === 'CREATED').map(session => (
        <li key={session._id}>
          {session._id === curSessionId
            ? '(current): '
            : <button
                className="btn btn-primary btn-sm"
                onClick={() => setStudentSession(session._id)}
              >
                Join
              </button>}
          {session._id} <i>({session.state}) </i>
        </li>
      ))}
    </ul>
  </div>
);

const ActivityBody = ({ activityId, state }) =>
  ({
    STARTED: activityId
      ? <Runner activityId={activityId} />
      : <h1>Session running & waiting for next activity</h1>,
    CREATED: <h1>The session will start soon</h1>,
    PAUSED: <h1>The session is paused</h1>,
    STOPPED: <h1>The session is stopped</h1>
  }[state]);

const SessionBody = ({ session }) =>
  session
    ? <ActivityBody activityId={session.activityId} state={session.state} />
    : <h1>Please chose a session to start learning</h1>;

const StudentView = ({ user, sessions }) => {
  const curSession = user.profile
    ? Sessions.findOne(user.profile.currentSession)
    : null;
  return (
    <div id="student">
      <SessionBody session={curSession} />
      <SessionList
        sessions={sessions}
        curSessionId={!!curSession && curSession._id}
      />
    </div>
  );
};

export default createContainer(
  () => {
    const sessions = Sessions.find().fetch();
    const user = Meteor.users.findOne(Meteor.userId());
    return { sessions, user };
  },
  StudentView
);
