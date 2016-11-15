import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { uuid } from 'frog-utils';
import { find, sortBy, reverse, take } from 'lodash';
import colorHash from 'color-hash';
import { objectize } from '../../lib/utils';

import { Sessions, addSession, updateSessionState, updateSessionActivity } from '../api/sessions';
import { Activities, Operators, addResult } from '../api/activities';
import { Logs, flushLogs } from '../api/logs';
import { Products } from '../api/products';

import { activity_types_obj } from '../activity_types';
import { operator_types_obj } from '../operator_types';

const ColorHash = new colorHash

const setTeacherSession = (session_id) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.controlSession':session_id}})
}

// check if there are any operators, and run these first
const switchActivity = (sessionid, activityid) => {
  const ops = Operators.find({'data.to': activityid}, {reactive: false}).fetch()
  if(ops.length > 0) {
    const op = ops[0]
    const operator_type = operator_types_obj[op.operator_type]
    const prod = Products.find({activity_id: op.data.from}, {reactive: false}).fetch()
    if(prod.length > 0) {
      const result = operator_type.operator(op.data, prod)
      addResult(activityid, result)
      console.log(result)
    }
  }
  updateSessionActivity(sessionid,activityid)
}
const SessionController = ( { session, activities } ) => { 
  return(
    session ? 
      <div>
        <h3>Session control</h3>
        Current state <b>{session.state}</b>. Control the session through selecting an activity below, or Starting/Pausing/Stopping the session.
        <h4>Available activities</h4>
        <ul> { 
          activities.map((activity) => {
            const running = activity._id == session.activity
            return (
            <li key={activity._id}>
              <a href='#' onClick={() => switchActivity(session._id,activity._id)}>
                {activity.data.name} - <i>{activity.activity_type}</i> {running ? <i> (running)</i> : ''}
              </a>
            </li>
            )
          }
          )
        } </ul>
        <button className='btn btn-primary btn-sm' onClick={() => updateSessionState(session._id,'STARTED')}>Start</button>&nbsp;
        <button className='btn btn-warning btn-sm' onClick={() => updateSessionState(session._id,'PAUSED') }>Pause</button>&nbsp;
        <button className='btn btn-danger btn-sm' onClick={() => updateSessionState(session._id,'STOPPED')}>Stop </button>&nbsp;
      </div>
    : <p>Chose a session</p>
  )
}

const SessionList = ( { sessions } ) => { return(
  <div>
    <h3>Session list</h3>
    <ul> { 
      sessions.map((session) => 
        <li key={session._id}>
          <a href='#' onClick={() => Sessions.remove({_id:session._id})}>
            <i className="fa fa-times"></i>&nbsp;
          </a>
          <a href='#' onClick={ () => setTeacherSession(session._id) }>
            <i className="fa fa-pencil"></i>&nbsp;
          </a>&nbsp;
          {session._id}
        </li>
      ) 
    } </ul>
    <button className='btn btn-primary btn-sm' onClick={addSession}>Add session</button>
  </div>
)}

const DashView = ({ user, logs }) => {
  const session = user.profile? Sessions.findOne({_id:user.profile.controlSession}):null
  if(!session) { return null }
  const activity = Activities.findOne({_id:session.activity})
  if(!activity) { return null }
  const activity_type = activity_types_obj[activity.activity_type]
  const specific_logs = logs.filter(x => x.activity == activity._id)
  if (!activity_type.Dashboard) { 
    return null 
  } else {
    return (
      <div><h3>Dashboard</h3>
        <activity_type.Dashboard logs={specific_logs} />
      </div>
    )
  }
}

const TeacherView = ( { activities, sessions, logs, user } ) => { return(
  <div>
    <SessionController 
      session={user.profile? Sessions.findOne({_id:user.profile.controlSession}):null}
      activities={activities}
    />
    <DashView
      user={user}
      logs={logs} 
    />
    <SessionList 
      sessions={sessions} 
    />
  </div>
)}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    sessions: Sessions.find({}).fetch(),
    logs: Logs.find({}, {sort:{created_at: -1}, limit: 100}).fetch(),
    user: Meteor.users.findOne({_id:Meteor.userId()})
  }
}, TeacherView)
