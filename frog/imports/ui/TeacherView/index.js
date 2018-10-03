// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';

import SessionList from './SessionList';
import OrchestrationView from './OrchestrationView';

import { GlobalSettings } from '../../api/globalSettings';
import { Activities } from '../../api/activities';
import { Graphs } from '../../api/graphs';
import { Sessions } from '../../api/sessions';
import { teacherLogger } from '../../api/logs';

class TeacherView extends React.Component<any, {}> {
  componentDidMount() {
    teacherLogger(this.props.session._id, 'teacher.enteredOrchestrationView');
  }

  componentWillUnmount() {
    teacherLogger(this.props.session._id, 'teacher.leftOrchestrationView');
  }

  render() {
    return (
      <>
        <OrchestrationView {...this.props} />
        {!this.props.session && <SessionList {...this.props} />}
      </>
    );
  }
}

const TeacherViewRunner = withRouter(
  withTracker(({ match, history }) => {
    const user = Meteor.user();
    let session;
    if (match?.params?.slug) {
      session = Sessions.findOne({
        slug: match.params.slug.trim().toUpperCase()
      });
      if (session) {
        Meteor.users.findOne(user._id, {
          $set: { 'profile.controlSession': session._id }
        });
      }
    }
    if (!session) {
      session = user.profile && Sessions.findOne(user.profile.controlSession);
    }
    if (session && session.slug !== match.params.slug) {
      history.push('/teacher/orchestration/' + session.slug);
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
  })(TeacherView)
);

TeacherViewRunner.displayName = 'TeacherViewRunner';
export default TeacherViewRunner;
