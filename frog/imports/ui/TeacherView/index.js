// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { withVisibility } from 'frog-utils';

import StudentList from './StudentList';
import ButtonList from './ButtonList';
import SessionList from './SessionList';
import GraphView from './GraphView';
import Dashboards from './Dashboard';
import { Sessions } from '../../api/sessions';
import { Activities } from '../../api/activities';
import { Graphs } from '../../api/graphs';

const rawSessionController = ({ session, visible, toggleVisibility }) =>
  <div>
    {session
      ? <div>
          <ButtonList session={session} toggle={toggleVisibility} />
          {visible
            ? <Dashboards
                session={session}
                openActivities={session.openActivities}
              />
            : <GraphView session={session} />}
        </div>
      : <p>Create or select a session from the list below</p>}
  </div>;

const SessionController = withVisibility(rawSessionController);
SessionController.displayName = 'SessionController';

const TeacherView = createContainer(
  () => {
    const user = Meteor.users.findOne(Meteor.userId());
    const session =
      user.profile && Sessions.findOne(user.profile.controlSession);
    const activities =
      session && Activities.find({ graphId: session.graphId }).fetch();
    const students =
      session && Meteor.users.find({ joinedSessions: session.slug }).fetch();

    return {
      sessions: Sessions.find().fetch(),
      session,
      graphs: Graphs.find({ broken: { $ne: true } }).fetch(),
      activities,
      students,
      user
    };
  },
  props =>
    <div id="teacher" style={{ display: 'flex' }}>
      <div style={{ width: '80%' }}>
        <SessionController {...props} />
        <hr />
        {props.students && <StudentList students={props.students} />}
        <hr />
        <SessionList {...props} />
      </div>
    </div>
);

TeacherView.displayName = 'TeacherView';
export default TeacherView;
