import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { uuid } from 'frog-utils';
import { find, sortBy, reverse, take } from 'lodash';
import colorHash from 'color-hash';
import { objectize } from '../../lib/utils';

import { AppState } from '../api/appstate';
import { Sessions, addSession, updateSessionState, updateSessionActivity } from '../api/sessions';
import { Activities } from '../api/activities';
import { Logs, flushLogs } from '../api/logs';

const SessionControl = ( { id, activities } ) => { 
  const session = Sessions.findOne({_id:id});
  return(
    <div>
      <p>session={id}, state={session.state}, activity={session.activity}</p>
      <ul> { 
        activities.map((activity) => 
          <li key={activity._id}>
            <button onClick={() => updateSessionActivity(id,activity._id)}>Select</button>
            {activity.data.name}
          </li>
        )
      } </ul>
      <button onClick={() => updateSessionState(id,'STARTED')}>Start</button>
      <button onClick={() => updateSessionState(id,'PAUSED') }>Pause</button>
      <button onClick={() => updateSessionState(id,'STOPPED')}>Stop </button>
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
