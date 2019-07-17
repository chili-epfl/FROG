// @flow
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

type Profile = { displayName: string };

const errorBasedOnChars = (
  value: string,
  numberOfChars: number,
  type: string
) => {
  return value.length < numberOfChars
    ? `${type} has to have a minimum of ${numberOfChars} characters`
    : '';
};

const emailErrors = (email: string) => {
  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  if (email.length === 0)
    return 'This field is required, please enter an email address';
  return emailRegex.test(email) ? '' : 'invalid email address';
};
const passwordErrors = (password: string) => {
  return errorBasedOnChars(password, 5, 'password');
};

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
  if (password !== '' && email !== '' && profile.displayName !== '') {
    // Validate input params
    if (
      passwordErrors(password) !== '' ||
      emailErrors(email) !== '' ||
      errorBasedOnChars(profile.displayName, 1, 'Display Name') !== ''
    ) {
      throw new Meteor.Error(
        passwordErrors(password) +
          '  ' +
          emailErrors(email) +
          '  ' +
          errorBasedOnChars(profile.displayName, 1, 'Display Name')
      );
    } else if (!Accounts.findUserByEmail(email)) {
      const user = Meteor.user();

      if (user?.isAnonymous) {
        // checks for duplicate email and displays error on the console.

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
    } else {
      throw new Meteor.Error('Email already exists');
    }
  } else {
    throw new Meteor.Error('Invalid arguments');
  }
};

Meteor.methods({
  'create.account': createAccount
});
