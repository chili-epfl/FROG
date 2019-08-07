// @flow
import { Meteor } from 'meteor/meteor';

import { hashCode } from '/imports/frog-utils';
import animals from './animals';

type MeteorUser = {
  _id: string,
  emails?: string[],
  username: string,
  isAnonymous: boolean,
  profile?: { displayName: string }
};
type UserObj = {
  id?: string,
  meteorUser?: MeteorUser
};
type UserType = 'Anonymous' | 'Verified' | 'Legacy' | 'No user logged in';

const getAnimalAnonymous = (userId: string): string => {
  const animal = animals[Math.abs(hashCode(userId)) % 286];
  return 'Anonymous ' + animal;
};

/**
 * Returns the appropriate username based on the type of user. If no user is passed then will return the current user's username
 *
 * @param: {User=} user
 */

export const getUsername = (
  user?: UserObj,
  wiki?: boolean = false
): ?string => {
  const selectedUser = getUser(user);
  if (selectedUser) {
    if (selectedUser.isAnonymous)
      return wiki ? getAnimalAnonymous(selectedUser._id) : 'Anonymous User';
    else if (selectedUser.emails) return selectedUser.profile.displayName;
    else if (selectedUser.username) return selectedUser.username;
  }
  return undefined;
};
/**
 * Returns the type of the given user if the user is passed or the current user
 * @param: {User=} user
 */
export const getUserType = (user?: UserObj): UserType => {
  const selectedUser = getUser(user);
  // if there is no user logged in then we treat it the same as anonymous
  if (!selectedUser || selectedUser.isAnonymous) return 'Anonymous';
  // eslint-disable-next-line no-extra-boolean-cast
  else if (isVerifiedUser({ meteorUser: selectedUser })) return 'Verified';
  else if (selectedUser.username) return 'Legacy';
  else return 'No user logged in';
};
/**
 * Returns the appropriate user object based on the type of user. If no user is passed as args then will return the current user object.
 * If there is no user logged in, returns undefined.
 * @param: {User=} user
 */
const getUser = (user?: UserObj): ?MeteorUser => {
  // object spread to allow destructure a null object
  const { id, meteorUser } = { ...user };
  if (id) return Meteor.users.findOne(id);
  else if (meteorUser) return meteorUser;
  else return Meteor.user();
};

/**
 * Returns whether the given user is verified i.e. has an email. If no user is provided then will return whether the current user is verified.
 *
 * @param: {User=} user
 */

const isVerifiedUser = (user?: UserObj): boolean => {
  const selectedUser = getUser(user);
  if (selectedUser) return !!selectedUser.emails;
  else return false;
};
