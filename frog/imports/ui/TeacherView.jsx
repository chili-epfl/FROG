import React, { Component } from 'react';
import { Activities, Sessions, Logs } from '../api/db'
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { uuid } from 'frog-utils'
import { find, sortBy, reverse, take } from 'lodash'
import colorHash from 'color-hash'
import { objectize } from '../../lib/utils'
const ColorHash = new colorHash

import ActivityTypes from '../activities'

const getCurrentSession = (id) => {
  return Sessions.find({_id:id}).fetch()[0];
}

const changeCurrentSessionState = (id,state) => {
  Sessions.update({_id:id},{$set: {state:state}})
}

const changeCurrentSessionActivity = (id,activity) => {
  Sessions.update({_id:id},{$set: {activity:activity}})
}

const SessionControl = ( { id, activities } ) => { 
  const session = getCurrentSession(id);
  return(
    <div>
      <p>session={id}, state={session.state}, activity={session.activity}</p>
      <ul> { 
        activities.map((activity) => 
          <li key={activity._id}>
            <button onClick={() => changeCurrentSessionActivity(id,activity._id)}>Select</button>
            {activity.data.name}
          </li>
        )
      } </ul>
      <button onClick={() => changeCurrentSessionState(id,'STARTED')}>Start</button>
      <button onClick={() => changeCurrentSessionState(id,'PAUSED') }>Pause</button>
      <button onClick={() => changeCurrentSessionState(id,'STOPPED')}>Stop </button>
    </div>
  )
}

const SessionList = ( { sessions, setSession } ) => { return(
  <ul> { 
    sessions.map((session) => 
      <li key={session._id}>
        <button onClick={() => Sessions.remove({_id:session._id})}>Delete</button>
        <button onClick={ () => setSession(session._id) }>control</button>
        {session._id}
      </li>
    ) 
  } </ul>
)}

class TeacherView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSession:null
    }
  }

  render() {
    return(
      <div>
        <h1>Session control</h1>
        { this.state.currentSession ?
          <SessionControl 
            id={this.state.currentSession}
            activities={this.props.activities}
          />
          : <p>Chose a session</p>
        }

        <h1>Session list</h1>
        <button onClick={ () => Sessions.insert({state:"CREATED"}) }>Add session</button>
        <SessionList sessions={this.props.sessions} setSession={ (id) => this.setState({currentSession:id}) } />

        <div> { 
          take(reverse(sortBy(this.props.logs,'created_at',false)),10).map(x => 
            <tr key={x._id} style={{color: ColorHash.hex(x.user)}}>
              <td>{x.created_at}</td>
              <td>{x.user}</td>
              <td>{x.message}</td>
            </tr>
          ) 
        } 
        </div>
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    sessions: Sessions.find({}).fetch(),
    logs: Logs.find({}).fetch(),
  }
}, TeacherView)

