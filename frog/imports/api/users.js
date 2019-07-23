import { Meteor } from 'meteor/meteor';

type User = {
  id?: string,
  userObj?: mixed
};

// user id and user is optional if not supplied will use the current user
export const getUsername = (user: User) => {
  const selectedUser = getUser(user);
  if (selectedUser) {
    if (selectedUser.isAnonymous) return 'Anonymous User';
    else if (selectedUser.emails) return selectedUser.profile.displayName;
    else if (selectedUser.username) return selectedUser.username;
  }
  return 'No user logged in';
};

// user id and user are optional. If both are null then will return the current user.
const getUser = (user: User) => {
  if (!user) return Meteor.user();
  else {
    const { id, userObj } = user;
    return Meteor.users.findOne(id) || userObj;
  }
};

export const isVerifiedUser = (user: User) => {
  if (!user) {
    return !!Meteor.user().emails;
  } else {
    const { id, userObj } = user;
    return !!(Meteor.users.findOne(id).emails || userObj.emails);
  }
};
