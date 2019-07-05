import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

/**
 * Creates a new user account if userid is null or upgrades adds the new information to the given userid and makes the given account 'verified'.
 * @optional: {string} userid - current user
 * @param: {string}, email - email to be associated with the acount
 * @param: {string}, password - password of the new account
 * @param: {Object}, profile - user profile which consists of the DisplayName
 */

export const createAccount = (
  userid: string,
  email: string,
  password: string,
  profile: Object
) => {
  const user = Meteor.user();
  if (userid && user?.isAnonymous) {
    Meteor.users.update(userid, {
      $set: {
        emails: [{ address: email, verified: false }],
        isAnonymous: false,
        profile
      }
    });
    Accounts.setPassword(userid, password, { logout: false });
  } else {
    Accounts.createUser({
      email,
      password,
      profile
    });
    const userId = Accounts.findUserByEmail(email);
    Meteor.users.update(userId, {
      $set: {
        isAnonymous: false
      }
    });
  }
};

Meteor.methods({
  'create.account': createAccount
});
