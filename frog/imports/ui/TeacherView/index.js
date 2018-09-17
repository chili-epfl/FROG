// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SessionList from './SessionList';
import OrchestrationView from './OrchestrationView';

import { GlobalSettings } from '../../api/globalSettings';
import { Activities } from '../../api/activities';
import { Graphs } from '../../api/graphs';
import { Sessions } from '../../api/sessions';

const TeacherView = props => (
  <>
    <OrchestrationView {...props} />
    {!props.session && <SessionList {...props} />}
  </>
);

const TeacherViewRunner = withTracker(({ match }) => {
  const user = Meteor.user();
  let session;
  if (match?.params?.graphId) {
    const graph = Graphs.findOne(match.params.graphId.trim());
    if (graph.sessionId) {
      session = Sessions.findOne(graph.sessionId);
      Meteor.users.findOne(user._id, {
        $set: { 'profile.controlSession': session._id }
      });
    }
  }
  if (!session) {
    session = user.profile && Sessions.findOne(user.profile.controlSession);
  }
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
