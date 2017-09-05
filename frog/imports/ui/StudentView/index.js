// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';

import SessionBody from './SessionBody';
import {
  Sessions,
  setStudentSession,
  ensureReactive
} from '../../api/sessions';
import { FourOhFour } from '../App/FROGRouter';

const StudentView = ({ session, doRedirect, cannotFind, tooLate }) => {
  if (doRedirect) {
    return <Redirect to="/" />;
  }

  if (tooLate) {
    return <h1>Too late to join this session</h1>;
  }

  if (cannotFind) {
    return <FourOhFour />;
  }

  return (
    <div id="student" style={{ width: '100%', height: '100%' }}>
      {session && <SessionBody session={session} />}
    </div>
  );
};

export default createContainer(props => {
  const users = Meteor.users.find(Meteor.userId()).fetch();
  const user = users && users[0];
  const curSession =
    user && user.profile ? Sessions.findOne(user.profile.currentSession) : null;

  if (!user) {
    return { cannotFind: true };
  }

  const desiredSlug = props.match && props.match.params.slug;

  if (!desiredSlug) {
    if (curSession) {
      return { session: curSession, user };
    } else {
      return { cannotFind: true };
    }
  }

  const desiredSession = Sessions.findOne({ slug: desiredSlug.toUpperCase() });
  const desiredId = desiredSession && desiredSession._id;

  if (!desiredSession) {
    return { cannotFind: true };
  }

  if (curSession && desiredId === curSession) {
    return { session: curSession, user, doRedirect: true };
  }

  if (desiredSession.tooLate === true) {
    return { tooLate: true };
  }

  setStudentSession(desiredId);
  ensureReactive(desiredId);

  return { session: curSession, user, doRedirect: true };
}, StudentView);
