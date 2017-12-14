// @flow
/* eslint-disable func-names */

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';
import { isEmpty } from 'lodash';

import { Sessions } from '../imports/api/sessions';

const doLogin = (user, self) => {
  const alreadyUser = Meteor.users.findOne({ 'services.frog.id': user });
  if (alreadyUser) {
    return Accounts._loginUser(self, alreadyUser._id);
  }

  const { userId } = Accounts.updateOrCreateUserFromExternalService('frog', {
    id: user
  });
  Meteor.users.update(userId, { $set: { username: user } });
  const stampedLoginToken = Accounts._generateStampedLoginToken();
  Accounts._insertLoginToken(userId, stampedLoginToken);

  const result = Accounts._loginUser(self, userId);
  return result;
};

Meteor.methods({
  'frog.username.login': function(user, token, isStudentList) {
    const self = this;
    if (
      !isStudentList &&
      process.env.NODE_ENV === 'production' &&
      token !== Meteor.settings.token
    ) {
      return 'NOTVALID';
    } else {
      return doLogin(user, self);
    }
  },
  'frog.studentlist': function(slug) {
    if (typeof slug !== 'string') {
      return -1;
    }
    const session = Sessions.findOne({ slug: slug.trim().toUpperCase() });
    if (session && !isEmpty(session.studentlist)) {
      return session.studentlist;
    } else {
      return -1;
    }
  },
  'create.many': function(slug) {
    let i = 200;
    while (i > 0) {
      i -= 1;
      const newUser = uuid();
      const { userId } = Accounts.updateOrCreateUserFromExternalService(
        'frog',
        {
          id: newUser
        }
      );
      Meteor.users.update(userId, { $push: { joinedSessions: slug } });
    }
  }
});
