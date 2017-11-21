// @flow
/* eslint-disable func-names */

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';
import { isEmpty } from 'lodash';
import fs from 'fs';

import { Sessions } from '../imports/api/sessions';

let teacherToken;
const tokenPath = `${process.cwd()}/../../../../../TEACHER_TOKEN`;
try {
  teacherToken = fs
    .readFileSync(tokenPath)
    .toString()
    .trim();
} catch (e) {
  teacherToken = uuid().toString();
  fs.writeFileSync(tokenPath, teacherToken);
}

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

if (true) {
  // (process.env.NODE_ENV !== 'production') {
  Meteor.methods({
    'frog.debuglogin': function(user) {
      const self = this;
      return doLogin(user, self);
    }
  });
}

Meteor.methods({
  'frog.teacherlogin': function(token) {
    if (token === teacherToken) {
      const self = this;
      return doLogin('teacher', self);
    } else {
      return 'NOTVALID';
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
  }
});

Meteor.methods({
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
