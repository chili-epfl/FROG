import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { uuid } from 'frog-utils';
import { sortBy, reverse, take, find } from 'lodash';
import { objectize, objectIndex } from '../../lib/utils';

import { Sessions } from '../api/sessions';
import { Activities } from '../api/activities';
import { Products } from '../api/products';

import Runner from './student_view/Runner.jsx';

const setStudentSession = (session_id) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.currentSession':session_id}})
}

const SessionList = ( { sessions, curSessionId } ) => { return(
  <div>
    <h3>Session list</h3>
    <ul> { 
      sessions.map((session) => 
        <li key={session._id}>
          { session._id == curSessionId ? 
            '(current): ' :
            <button className='btn btn-primary btn-sm' onClick={ () => setStudentSession(session._id) }>Join</button> }
          {session._id} <i>({session.state}) </i>
        </li>
      ) 
    } </ul>
  </div>
)}

const ActivityBody = ( { activity, state, products } ) => {
  // check if product has been submitted - means completed (might change this to also allow completion
  // of product-less activities)
  if(state != 'STARTED') { 
    return( <h1>Paused</h1> )
  }
  if(!activity) { 
    return( <h1>No activity selected</h1> )
  }
  if(products.filter(x => x.activity_id == activity._id).length > 0) { 
    return( <h1>Waiting for next activity</h1> ) 
  }
  return (<Runner activity={activity} />)
}

const SessionBody = ( { session, products } ) =>  { return (
  session ? 
    <div>
      <ActivityBody activity={Activities.findOne({_id:session.activity})} state={session.state} products={products}/>
    </div>
    : <p>Please chose a sesssion</p> 
)}

const StudentView = ( { user, sessions, products } ) => { 
  const curSession = user.profile? Sessions.findOne({_id:user.profile.currentSession}) : null 

  return(
  <div>
    <SessionBody 
      session={curSession} 
      products={products} />
    <SessionList 
      sessions={sessions}
      curSessionId={curSession && curSession._id} />
  </div>
)}

export default createContainer(() => {
  return {
    sessions: Sessions.find().fetch(),
    user: Meteor.users.findOne({_id:Meteor.userId()}),
    products: Products.find({user_id:Meteor.userId()}).fetch()
  }
}, StudentView)