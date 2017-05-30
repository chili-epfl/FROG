import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import SessionBody from './SessionBody';
import SessionList from './SessionList';
import { Sessions } from '../../api/sessions';

const StudentView = ({ user, sessions }) => {
  const curSession = user.profile
    ? Sessions.findOne(user.profile.currentSession)
    : null;
  return (
    <div id="student">
      {curSession
        ? <SessionBody session={curSession} />
        : <SessionList sessions={sessions} />}
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
