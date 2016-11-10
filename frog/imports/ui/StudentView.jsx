import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { uuid } from 'frog-utils';
import { sortBy, reverse, take, find } from 'lodash';
import { objectize } from '../../lib/utils';

import { createLogger } from '../api/logs';
import { Sessions } from '../api/sessions';
import { Activities } from '../api/activities';
import { ActivityData, reactiveData } from '../api/activity_data';
import CollabRunner from './student_view/CollabRunner.jsx'

import { activity_types_obj } from '../activity_types';

const setStudentSession = (session_id) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.currentSession':session_id}})
}

const SessionList = ( { sessions } ) => { return(
  <ul> { 
    //sessions.filter((session) => session.state=='CREATED').map((session) => 
    sessions.map((session) => 
      <li key={session._id}>
        <button onClick={ () => setStudentSession(session._id) }>Join</button>
        {session.state}
        {session._id}
      </li>
    ) 
  } </ul>
)}

// hard-coding for testing purposes
const social_structure = {
  "Z7HN7hvJqPg5eiHwQ": 1,
  "swDPDmYLk9vBT9Agj": 1,
  "56CCzkmP79ePebWJ7": 2,
  "42GRqF7KkjKDfddeb": 2
}


const Runner = ( { activity } ) => {
  const activity_type = activity_types_obj[activity.activity_type]

  if(activity_type.meta.mode == 'collab') { 
    return <CollabRunner 
      activity={activity} 
      session_id={1} 
      group_id={social_structure[Meteor.userId()]} />
  } else {
    const logger = createLogger({
      activity: activity._id, 
      activity_type: activity.activity_type, 
      user: Meteor.userId()
    })
    return <activity_type.ActivityRunner 
      config={activity.data} 
      logger={logger} />
  }
}

const ActivityBody = ( { activity, state } ) => {
  return(state=='STARTED' ?
    (activity ? 
      <Runner activity={activity}/> :
        <h1>No activity selected</h1>) :
      <h1>Paused</h1>)
}

const SessionBody = ( { session } ) =>  { return (
  session ? 
    <div>
      <p>session={session._id}, state={session.state}, activity={session.activity}</p> 
      <ActivityBody activity={Activities.findOne({_id:session.activity})} state={session.state}/>
    </div>
    : <p>Please chose a sesssion</p> 
)}

const StudentView = ( { user, sessions } ) => { return(
  <div>
    <h1>Session</h1>
    <SessionBody session={user.profile? Sessions.findOne({_id:user.profile.currentSession}):null} />
    <h1>Session list</h1>
    <SessionList sessions={sessions} />
  </div>
)}

export default createContainer(() => {
  return {
    sessions: Sessions.find().fetch(),
    user: Meteor.users.findOne({_id:Meteor.userId()}),
  }
}, StudentView)
