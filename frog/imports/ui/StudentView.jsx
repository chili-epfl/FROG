import React, { Component } from 'react';
import { Activities, Sessions, Logs } from '../api/db'
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { uuid } from 'frog-utils'
import { sortBy, reverse, take, find } from 'lodash'
import { objectize } from '../../lib/utils'

import ActivityTypes from '../activities'

const setUserCurrentSession = (session_id) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.currentSession':session_id}})
}

const getSession = (session_id) => {
  return Sessions.find({_id:session_id}).fetch()[0];
}

const SessionList = ( { sessions } ) => { return(
  <ul> { 
    sessions.filter((session) => session.state=='CREATED').map((session) => 
      <li key={session._id}>
        <button onClick={ () => setUserCurrentSession(session._id) }>Join</button>
        {session.state}
        {session._id}
      </li>
    ) 
  } </ul>
)}

const SessionBody = ( { session } ) =>  { return (
    session ? 
      <p>session={session._id}, state={session.state}, activity={session.activity}</p> 
      : <p>Chose a sesssion</p> 
)}

const StudentView = ( { user, sessions } ) => { return(
  <div>
    <h1>Session</h1>
    <SessionBody session={user.profile? getSession(user.profile.currentSession):null} />
    <h1>Session list</h1>
    <SessionList sessions={sessions} />
  </div>
)}

export default createContainer(() => {
  return {
    sessions: Sessions.find().fetch(),
    user: Meteor.users.findOne({_id:Meteor.userId()})
  }
}, StudentView)
