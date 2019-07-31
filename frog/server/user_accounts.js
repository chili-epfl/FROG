// @flow
/* eslint-disable func-names */
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { uuid } from '/imports/frog-utils';
import { isVerifiedUser } from '/imports/api/users';
import { Sessions } from '../imports/api/sessions';

const doLogin = (user, self) => {
  if (user) {
    const alreadyUser = Meteor.users.findOne({ 'services.frog.id': user });
    if (alreadyUser) {
      return Accounts._loginUser(self, alreadyUser._id);
    }
  }
  const userServiceData = {
    id: user || uuid()
  };
  const { userId } = Accounts.updateOrCreateUserFromExternalService(
    'frog',
    userServiceData
  );
  Meteor.users.update(userId, {
    $set: {
      username: user || uuid(),
      isAnonymous: !user
    }
  });

  const result = Accounts._loginUser(self, userId);
  return result;
};

const cleanStudentList = studentList =>
  studentList
    ? [
        ...new Set(
          studentList
            .split('\n')
            .map(x => x.trim())
            .filter(x => x.length > 0)
            .sort((a, b) => a.localeCompare(b))
        )
      ].join('\n')
    : '';

Meteor.methods({
  'frog.username.login': function(username, token, isStudentList, slug) {
    const self = this;
    const userObj = Meteor.users.findOne({ username });
    // for anonymous login 
    if(username=== null) return doLogin(username, self); 
    if (!isStudentList && userObj && isVerifiedUser({ userObj })) {
      return 'NOTVALID';
    } else {
      if (isStudentList) {
        const session = Sessions.findOne({ slug: (slug || '').toUpperCase() });
        if (session) {
          const studentlist =
            (session.settings && session.settings.studentlist) || '';
          if (
            !studentlist
              .split('\n')
              .map(x => x.toUpperCase())
              .includes(username.toUpperCase())
          ) {
            Sessions.update(session._id, {
              $set: {
                'settings.studentlist': cleanStudentList(
                  studentlist + '\n' + username
                )
              }
            });
          }
        }
      }

      return doLogin(username, self);
    }
  },
  'frog.userid.login': function(userId) {
    const self = this;
    const userDoc = Meteor.users.findOne({ _id: userId });
    if (!userDoc) {
      throw new Meteor.Error('Unable to find any user with the given userId');
    }
    const result = Accounts._loginUser(self, userId);
    return result;
  },
  'frog.session.settings': function(slug) {
    if (typeof slug !== 'string') {
      return -1;
    }
    const session = Sessions.findOne({ slug: slug.trim().toUpperCase() });
    if (!session) {
      return -1;
    }
    if (session.tooLate) {
      return { tooLate: true, ...(session.settings || {}) };
    } else {
      return session.settings || {};
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
  },
  'change.username': function(newName) {
    if (Meteor.users.findOne({ username: newName })) {
      throw new Meteor.Error('User already exists');
    }
    Meteor.users.update(this.userId, {
      $set: {
        'services.frog.id': newName,
        username: newName,
        isAnonymous: false
      }
    });
  }
});
