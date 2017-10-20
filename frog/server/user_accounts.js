// @flow
/* eslint-disable func-names */

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';
import fs from 'fs';

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
  const result = Accounts._loginUser(self, userId);
  return result;
};

if (process.env.NODE_ENV !== 'production') {
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
  }
});
