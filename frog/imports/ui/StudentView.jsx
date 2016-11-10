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
import { Products, addProduct } from '../api/products'
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
        <button className='btn btn-primary btn-sm' onClick={ () => setStudentSession(session._id) }>Join</button>
        {session._id} <i>({session.state}) </i>
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
  const onCompletion = (data) => addProduct(activity._id, activity.activity_type, Meteor.userId(), data)

  if(activity_type.meta.mode == 'collab') { 
    return <CollabRunner 
      activity={activity} 
      session_id={1} 
      group_id={social_structure[Meteor.userId()]}
      onCompletion={onCompletion}/>
  } else {
    const logger = createLogger({
      activity: activity._id, 
      activity_type: activity.activity_type, 
      user: Meteor.userId()
    })
    const onCompletion = (data) => addProduct(activity._id, activity.activity_type, Meteor.userId(), data)
    return <activity_type.ActivityRunner 
      config={activity.data} 
      logger={logger}
      onCompletion={onCompletion}
      />
  }
}

const ActivityBody = ( { activity, state, products } ) => {
  // check if product has been submitted - means completed (might change this to also allow completion
  // of product-less activities)
  if(state != 'STARTED') { return <h1>Paused</h1> }
  if(!activity) { return <h1>No activity selected</h1> }
  if (products.filter(x => x.activity_id == activity._id).length > 0) { return(<h1>Waiting for next activity</h1>) }

  return( <Runner activity={activity}/> )
}

const SessionBody = ( { session, products } ) =>  { return (
      // <p>session={session._id}, state={session.state}, activity={session.activity}</p>
  session ? 
    <div>
      <ActivityBody activity={Activities.findOne({_id:session.activity})} state={session.state} products={products}/>
    </div>
    : <p>Please chose a sesssion</p> 
)}

const StudentView = ( { user, sessions, products } ) => { return(
  <div>
    <SessionBody session={user.profile? Sessions.findOne({_id:user.profile.currentSession}):null} products={products}/>
    <hr />
    <h3>Session list</h3>
    <SessionList sessions={sessions} />
  </div>
)}

export default createContainer(() => {
  return {
    sessions: Sessions.find().fetch(),
    user: Meteor.users.findOne({_id:Meteor.userId()}),
    products: Products.find({user_id:Meteor.userId()}).fetch()
  }
}, StudentView)
