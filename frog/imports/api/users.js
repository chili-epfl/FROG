import {Meteor} from 'meteor/meteor'; 
// user id and user is optional if not supplied will use the current user 
export const getUsername = (user) =>  {
	const {id, userObj} = user; 
	const selectedUser = Meteor.users.findOne(id) || userObj || Meteor.user(); 
	if (selectedUser){
    if (selectedUser.isAnonymous) return "Anonymous User";
	else if (selectedUser.emails) return selectedUser.profile.displayName; 
	else if (selectedUser.username) return selectedUser.username; 
	}
	return "No user logged in"; 
	

}
// user id and user are optional. If both are null then will return the current user. 
export const getUser = (user) => {
	const {id, userObj} = user; 
	return Meteor.users.findOne(id) || userObj || Meteor.user(); 
}

export const isVerifiedUser = (user) => {
	const {id, userObj} = user; 
	if (Meteor.users.findOne(id).emails || userObj.emails || Meteor.user().emails){
	    return true; 
	}
	return false; 
}

