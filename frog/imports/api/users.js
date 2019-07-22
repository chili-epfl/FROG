import {Meteor} from 'meteor/meteor'; 
// user id and user is optional if not supplied will use the current user 
export const getUsername = (userid, user) =>  {
	const selectedUser = Meteor.user.findOne(userid) || user || Meteor.user(); 
	if (selectedUser){
    if (selectedUser.isAnonymous) return "Anonymous User";
	else if (selectedUser.emails) return selectedUser.profile.displayName; 
	else if (selectedUser.username) return selectedUser.username; 
	}
	return "No user logged in"; 
	

}
// user id and user are optional. If both are null then will return the current user. 
export const getUser = (userid, user) => {
	return Meteor.users().findOne(userid) || user || Meteor.user(); 
}

export const isVerifiedUser = (userid, user) => {
	if (Meteor.users().findOne(userid)?.emails || user?.emails
}

