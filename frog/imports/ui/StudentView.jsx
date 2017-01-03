import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Sessions } from '../api/sessions';
import { Activities } from '../api/activities';
import { Products } from '../api/products';

import Runner from './studentView/Runner.jsx';

const setStudentSession = (sessionId) => {
  Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.currentSession': sessionId } })
}

const SessionList = ({ sessions, curSessionId }) =>
  <div>
    <h3>Session list</h3>
    <ul> {sessions.map((session) =>
      <li key={session._id}>
        { session._id === curSessionId ? '(current): ' :
        <button className='btn btn-primary btn-sm' onClick={() => setStudentSession(session._id)}>Join</button> }
        {session._id} <i>({session.state}) </i>
      </li>
    )} </ul>
  </div>

const ActivityBody = ({ activity, state, products }) => {
  // check if product has been submitted - means completed
  // (might change this to also allow completion of product-less activities)
  if (state !== 'STARTED') { return (<h1>Paused</h1>) }
  if (!activity) { return (<h1>No activity selected</h1>) }
  if (products.filter((x) => x.activity_id === activity._id).length > 0) {
    return (<h1>Waiting for next activity</h1>)
  }
  return (<Runner activity={activity} />)
}

const SessionBody = ({ session, products }) => {
  if (session) {
    return (
      <div>
        <ActivityBody
          activity={Activities.findOne({ _id: session.activity })}
          state={session.state}
          products={products}
        />
      </div>
    )
  }
  return (<p>Please chose a sesssion</p>)
}

const StudentView = ({ user, sessions, products }) => {
  const curSession = user.profile ? Sessions.findOne({ _id: user.profile.currentSession }) : null
  return (
    <div>
      <SessionBody session={curSession} products={products} />
      <SessionList sessions={sessions} curSessionId={!!curSession && curSession._id} />
    </div>
  )
}

export default createContainer(() => {
  const sessions = Sessions.find().fetch()
  const user = Meteor.users.findOne({ _id: Meteor.userId() })
  const products = Products.find({ userId: Meteor.userId() }).fetch()
  return ({ sessions, user, products })
}, StudentView)
