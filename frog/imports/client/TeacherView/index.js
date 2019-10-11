// @flow

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';

import { OrchestrationView } from './OrchestrationView';

import { GlobalSettings, LocalSettings } from '/imports/api/settings';
import { Activities } from '/imports/api/activities';
import { Graphs } from '/imports/api/graphs';
import { Sessions } from '/imports/api/sessions';

const TeacherViewRunner = withRouter(
  withTracker(({ match, history }) => {
    const user = Meteor.user();
    let session;
    if (match?.params?.slug) {
      session = Sessions.findOne({
        slug: match.params.slug
          .trim()
          .toUpperCase()
          .replace('OLD', 'old')
      });
      if (session) {
        Meteor.users.findOne(user._id, {
          $set: { 'profile.controlSession': session._id }
        });
      }
    }

    if (
      session &&
      (!match.params.slug ||
        (session.slug !== match.params.slug &&
          !session.slug.includes('-old-') &&
          !match.params.slug.includes('-old')))
    ) {
      history.push('/t/' + session.slug + LocalSettings.UrlCoda);
    }
    if (session) {
      Meteor.subscribe('teacher.graph', session.graphId);
      Meteor.subscribe('session.students', session.slug);
      Meteor.subscribe('session_activities', session.slug);
      if (
        !(
          Meteor.user().joinedSessions &&
          Meteor.user().joinedSessions.includes(session.slug)
        )
      ) {
        Meteor.call('session.join', session.slug);
      }
    }
    const activities =
      session && Activities.find({ graphId: session.graphId }).fetch();
    const students =
      session && Meteor.users.find({ joinedSessions: session.slug }).fetch();

    let error = { title: 'Error', message: '' };
    if (!session) {
      error = {
        title: 'Session Not Found',
        message: 'This session does not exist'
      };
    }

    return {
      sessions: Sessions.find().fetch(),
      session,
      graphs: Graphs.find({ broken: { $ne: true } }).fetch(),
      activities,
      token: GlobalSettings.findOne('token'),
      students,
      user,
      error
    };
  })(OrchestrationView)
);

TeacherViewRunner.displayName = 'TeacherViewRunner';
export default TeacherViewRunner;
