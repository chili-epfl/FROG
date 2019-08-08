// @flow
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import {
  errorBasedOnChars,
  emailErrors,
  passwordErrors
} from '/imports/frog-utils/validationHelpers';
import { getUserType } from '/imports/api/users';

type Profile = { displayName: string };

/**
 * Creates a new user account if userid is null or upgrades adds the new information to the given userid and makes the given account 'verified'.
 *
 * @param: {string}, email - email to be associated with the acount
 * @param: {string}, password - password of the new account
 * @param: {Object}, profile - user profile which consists of the displayName
 */

export const createAccount = (
  email: string,
  password: string,
  profile: Profile
) => {
  // Validate input params to prevent incorrect data from the console/client.
  if (
    password !== '' &&
    password &&
    (email !== '' && email) &&
    (profile?.displayName && profile?.displayName !== '')
  ) {
    if (
      passwordErrors(password) !== '' ||
      emailErrors(email) !== '' ||
      errorBasedOnChars(profile?.displayName, 1, 'Display Name') !== ''
    ) {
      throw new Meteor.Error(
        passwordErrors(password) +
          '  ' +
          emailErrors(email) +
          '  ' +
          errorBasedOnChars(profile?.displayName, 1, 'Display Name')
      );
    } else if (!Accounts.findUserByEmail(email)) {
      const user = Meteor.user();
      // if the user is anonymous or a legacy user we want to simply add the email and password to their
      // account. This allows them to keep the graphs and activities they created when they didn't have an
      // account. Else we just create a new account
      if (
        getUserType({ meteorUser: user }) === 'Anonymous' ||
        getUserType({ meteorUser: user }) === 'Legacy'
      ) {
        Meteor.users.update(user._id, {
          $set: {
            emails: [{ address: email, verified: false }],
            isAnonymous: false,
            profile
          }
        });
        Accounts.setPassword(user._id, password, { logout: false });
      } else {
        Accounts.createUser({
          email,
          password,
          profile
        });
        const newUserId = Accounts.findUserByEmail(email);
        Meteor.users.update(newUserId, {
          $set: {
            isAnonymous: false
          }
        });
      }
      // error handling
    } else {
      throw new Meteor.Error('dup-email', 'Email already exists');
    }
  } else {
    throw new Meteor.Error('invalid-args', 'Invalid arguments');
  }
};

export const changeDisplayName = (newDisplayName: string) => {
  if (
    getUserType() === 'Verified' &&
    errorBasedOnChars(newDisplayName, 1, 'Display Name') === ''
  ) {
    Meteor.users.update(Meteor.user()._id, {
      $set: {
        profile: { displayName: newDisplayName }
      }
    });
  } else {
    throw new Meteor.Error('error', 'Could not change display name');
  }
};

Meteor.methods({
  'create.account': createAccount,
  'change.displayname': changeDisplayName
});
