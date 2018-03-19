// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import StudentList from './StudentList';
import SessionList from './SessionList';
import { GlobalSettings } from '../../api/globalSettings';
import { Activities } from '../../api/activities';
import { Graphs } from '../../api/graphs';
import { Sessions } from '../../api/sessions';
import OrchestrationView from './OrchestrationView';

const TeacherView = props => (
  <div>
    <OrchestrationView {...props} />
    {props.students && <StudentList students={props.students} />}
    <SessionList {...props} />
  </div>
);

const TeacherViewRunner = withTracker(() => {
  const user = Meteor.users.findOne(Meteor.userId());
  const session = user.profile && Sessions.findOne(user.profile.controlSession);
  const activities =
    session && Activities.find({ graphId: session.graphId }).fetch();
  const students =
    session && Meteor.users.find({ joinedSessions: session.slug }).fetch();
  return {
    sessions: Sessions.find().fetch(),
    session,
    graphs: Graphs.find({ broken: { $ne: true } }).fetch(),
    activities,
    token: GlobalSettings.findOne('token'),
    students,
    user
  };
})(TeacherView);

TeacherViewRunner.displayName = 'TeacherViewRunner';
export default TeacherViewRunner;
