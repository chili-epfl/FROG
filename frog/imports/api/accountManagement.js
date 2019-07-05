import { Accounts } from 'meteor/accounts-base'; 
import {Meteor} from 'meteor/meteor'; 
imp

//profile is an object which will contain the display name that the user inputs
export const createAccount = (userid: string, email: string, password: string, profile: Object) =>  {
    //If the user is already logged in as anonymous and tries to 'upgrade' their account by providing an email and 
     // password, we update the same users information. 
	if (userid && Meteor.user()?.isAnonymous){
		Meteor.users.update(userid, {$set: {'emails':[{address:email,verified:false}], 'isAnonymous': false, 'profile':profile}}); 
		Accounts.setPassword(userid, password,{logout:false}); 

	}
	else {
		Accounts.createUser({email:email, password:password, profile:
		profile}); 
		
      
	}
	

}

export const loginUser = (email:string, password:string) =>{
	Meteor.loginWithPassword({email: email}, {password: password}); 

}

export const logoutUser = () => {
	Meteor.logout(); 
}

Meteor.methods({
	'create.account': createAccount,
	'login.user': loginUser,
	'logout.user':logoutUser
}); 