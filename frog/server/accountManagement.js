
//@flow
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

type Profile = { displayName: string }


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
  const user = Meteor.user();

  if (user?.isAnonymous) {
    // checks for duplicate email and displays error on the console.
    if (!Accounts.findUserByEmail(email)) {
      Meteor.users.update(
        user._id,
        {
          $set: {
            emails: [{ address: email, verified: false }],
            isAnonymous: false,
            profile
          }
        }
      );
      Accounts.setPassword(user._id, password, { logout: false });
    } else {
      throw new Meteor.Error('Email already exists');
    }
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
};

Meteor.methods({
  'create.account': createAccount
});
