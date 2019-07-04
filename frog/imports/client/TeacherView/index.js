// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';

import SessionList from './SessionList';
import OrchestrationView from './OrchestrationView';

import { GlobalSettings, LocalSettings } from '/imports/api/settings';
import { Activities } from '/imports/api/activities';
import { Graphs } from '/imports/api/graphs';
import { Sessions } from '/imports/api/sessions';

const TeacherView = props => (
  <>
    {props.session ? (
      <OrchestrationView {...props} />
    ) : (
      <SessionList {...props} />
    )}
  </>
);

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

    if (!session) {
      session = user.profile && Sessions.findOne(user.profile.controlSession);
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
