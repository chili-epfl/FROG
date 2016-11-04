import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { uuid } from 'frog-utils';
import { find, sortBy, reverse, take } from 'lodash';
import colorHash from 'color-hash';
const ColorHash = new colorHash
import { objectize } from '../../lib/utils';

import { Sessions, addSession, updateSessionState, updateSessionActivity } from '../api/sessions';
import { Activities } from '../api/activities';
import { Logs, flushLogs } from '../api/logs';



const setTeacherSession = (session_id) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.controlSession':session_id}})
}

const SessionController = ( { session, activities } ) => { 
  return(
    session ? 
      <div>
        <h1>Session control</h1>
        <p>session={session._id}, state={session.state}, activity={session.activity}</p>
        <ul> { 
          activities.map((activity) => 
            <li key={activity._id}>
              <button onClick={() => updateSessionActivity(session._id,activity._id)}>Select</button>
              {activity.data.name}
            </li>
          )
        } </ul>
        <button onClick={() => updateSessionState(session._id,'STARTED')}>Start</button>
        <button onClick={() => updateSessionState(session._id,'PAUSED') }>Pause</button>
        <button onClick={() => updateSessionState(session._id,'STOPPED')}>Stop </button>
      </div>
    : <p>Chose a session</p>
  )
}

const SessionList = ( { sessions } ) => { return(
  <div>
    <h1>Session list</h1>
    <button onClick={addSession}>Add session</button>
    <ul> { 
      sessions.map((session) => 
        <li key={session._id}>
          <button onClick={() => Sessions.remove({_id:session._id})}>Delete</button>
          <button onClick={ () => setTeacherSession(session._id) }>control</button>
          {session._id}
        </li>
      ) 
    } </ul>
  </div>
)}

const LogView = ( { logs } ) => { return (
  <div>
    <h1>Logs</h1>
    <table><tbody>
      { logs.map((log) => 
        <tr key={log._id} style={{color: ColorHash.hex(log.user)}}>
          <td>{log.created_at}</td>
          <td>{log.user}</td>
          <td>{log.message}</td>
        </tr>
      )}
    </tbody></table>
  </div>
)}

const TeacherView = ( { activities, sessions, logs, user } ) => { return(
  <div>
    <SessionController 
      session={user.profile? Sessions.findOne({_id:user.profile.controlSession}):null}
      activities={activities}
    />
    <SessionList 
      sessions={sessions} 
    />
    <LogView 
      logs={logs} 
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
