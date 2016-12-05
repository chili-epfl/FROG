import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';

import { Activities } from './activities';
 
export const Sessions = new Mongo.Collection('sessions');

export const addSession = () => {
  Sessions.insert({
    _id: uuid(),
    state: 'CREATED',
    activity: null,
    startedAt: null,
    pausedAt: null
  })
}

export const updateSessionState = (id,state) => {
  Sessions.update({_id:id},{$set: {state:state}})
  if (state == 'STARTED'){
  	if (Sessions.findOne({_id:id}).pausedAt != null){
  		const newStartedAt = Sessions.findOne({_id:id}).startedAt + (new Date().getTime() - Sessions.findOne({_id:id}).pausedAt)
  		Sessions.update({_id:id},{$set: {startedAt:newStartedAt}})
  	}
  	Sessions.update({_id:id},{$set: {pausedAt:null}})
  }
  if (state == 'PAUSED'){
  	if (Sessions.findOne({_id:id}).pausedAt == null){
  		Sessions.update({_id:id},{$set: {pausedAt:new Date().getTime()}})
  	}
  }
}

export const updateSessionActivity = (id,activity) => {
  Sessions.update({_id:id},{$set: {activity:activity, startedAt:new Date().getTime()}})
}
