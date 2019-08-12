import {connection} from './connection'; 

export const resetShareDBConnection = () => {
	   connection.createFetchQuery('rz', { resetUserId: Meteor.userId() });
}