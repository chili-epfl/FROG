import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';

import { Activities } from './activities';
 
export const Sessions = new Mongo.Collection('sessions');

export const addSession = ( graphId ) => {
  Sessions.insert({
    _id: uuid(),
    graphId: graphId,
    state: 'CREATED',
    activity: null
  })
}

export const updateSessionState = (id,state) => {
  Sessions.update({_id:id},{$set: {state:state}})
}

export const updateSessionActivity = (id,activity) => {
  Sessions.update({_id:id},{$set: {activity:activity}})
}
