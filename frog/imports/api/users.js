// @flow
import { Meteor } from 'meteor/meteor';

type User = {
  id?: string,
  userObj?: mixed
};

/**
 * Returns the appropriate username based on the type of user. If no user is passed then will return the current user's username
 *
 * @param: {User=} user
 */

export const getUsername = (user: User) => {
  const selectedUser = getUser(user);
  if (selectedUser) {
    if (selectedUser.isAnonymous) return 'Anonymous User';
    else if (selectedUser.emails) return selectedUser.profile.displayName;
    else if (selectedUser.username) return selectedUser.username;
  }
  return 'No user logged in';
};

/**
 * Returns the appropriate user object based on the type of user. If no user is passed as args then will return the current user object.
 *
 * @param: {User=} user
 */
const getUser = (user: User) => {
  if (!user) return Meteor.user();
  else {
    const { id, userObj } = user;
    return Meteor.users.findOne(id) || userObj;
  }
};

/**
 * Returns whether the given user is verified i.e. has an email. If no user is provided then will return whether the current user is verified. 
 *
 * @param: {User=} user
 */

export const isVerifiedUser = (user: User) => {
  if (!user) {
  	// returns true if the emails field exists
    return !!Meteor.user().emails;
  } else {
    const { id, userObj } = user;
    return !!(Meteor.users.findOne(id).emails || userObj.emails);
  }
};
