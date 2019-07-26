// @flow
import { Meteor } from 'meteor/meteor';

type User = {
  id?: string,
  userObj?: { _id: string, emails: ?(string[]) }
};

/**
 * Returns the appropriate username based on the type of user. If no user is passed then will return the current user's username
 *
 * @param: {User=} user
 */

export const getUsername = (user: User): ?string => {
  const selectedUser = getUser(user);
  if (selectedUser) {
    if (selectedUser.isAnonymous) return 'Anonymous User';
    else if (selectedUser.emails) return selectedUser.profile.displayName;
    else if (selectedUser.username) return selectedUser.username;
  }
  return undefined;
};

/**
 * Returns the appropriate user object based on the type of user. If no user is passed as args then will return the current user object.
 *
 * @param: {User=} user
 */
const getUser = (user: User): ?userObj => {
  // object spread to allow destructure a null object
  const { id, userObj } = { ...user };
  if (id) return Meteor.users.findOne(id);
  else if (userObj) return userObj;
  else return Meteor.user();
};

/**
 * Returns whether the given user is verified i.e. has an email. If no user is provided then will return whether the current user is verified.
 *
 * @param: {User=} user
 */

export const isVerifiedUser = (user: User) => {
  const selectedUser = getUser(user);
  const { id, userObj } = selectedUser;
  if (id) return !!Meteor.users.findOne(id).emails;
  else if (userObj) return !!userObj.emails;
  else return !!selectedUser.emails;
};
