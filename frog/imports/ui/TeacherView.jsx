import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { uuid } from 'frog-utils'
import { find, sortBy, reverse, take } from 'lodash'
import colorHash from 'color-hash'
import { objectize } from '../../lib/utils'

import { AppState } from '../api/appstate'
import { Activities } from '../api/activities'
import { Logs, flushLogs } from '../api/logs'

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





<<<<<<< HEAD
import ActivityTypes from '../activities'
=======
const ColorHash = new colorHash

const Activity = ({ data, setFn }) => 
  <li key = {data._id}>
    <a href='#' onClick={ () => setFn() }>
      {data.data.name}
    </a>
  </li>
>>>>>>> frogv2-2

const ActivityList = ({ activities, setFn }) =>  
  <div>
<<<<<<< HEAD
    <ul>{ activities.map(x => 
      <li key={x._id}><a href='#' onClick={() => setFn(x)}>{x.data.name}</a></li>
    ) } </ul>
    <button onClick={() => setFn({_id:null})}>Pause</button>
  </div>
)}
=======
    <ul>
      { activities.map(x => <Activity data = {x} key = {x._id} setFn = {() => setFn(x)} />) }
    </ul>

    <button onClick={() => setFn({_id: null})} >Pause</button>
  <div>
  </div>


const LogEntry = ({ logdata }) => 
  <tr style={{color: ColorHash.hex(logdata.user)}}>
    <td>{logdata.created_at}</td>
    <td>{logdata.user}</td>
    <td>{logdata.message}</td>
  </tr>

const LogView = ({ logstream }) => {
  const logs = 
    chain(logstream).
    sortBy('created_at', false).
    reverse().
    take(10).
    value()
  
  return(
    <div>
      <h1>Log</h1>
      <button onClick={flushLogs}>
        Remove all
      </button> 
      <table>
        <tbody>
          { logs.map(x => <LogEntry logdata = {x} key = {x._id} />) }
        </tbody>
      </table>
    </div>
  )
}

>>>>>>> frogv2-2

class Engine extends Component {
  constructor(props) {
    super(props);
<<<<<<< HEAD
    this.state = {
      form: false,
      currentActivity: null
    }
  }

  getActivity = () => {
    const cur = this.props.activities.length > 0 ?  
      this.props.activities.filter(x => x._id == this.props.appstate.currentActivity)[0] :
      null
    return cur
  }
    
  render() {
    return(
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <h1>Running activity</h1>
                { this.getActivity() ? this.getActivity().data.name  : 'Paused' }
              </td>
              <td>
                <h1>Activity list</h1>
                <ActivityList activities={this.props.activities} setFn={
                  (x) => console.log('hello from Engine.jsx')
                } />
              </td>
            </tr>
          </tbody>
        </table>
        <h1>Log</h1>
        <button onClick={() => this.props.logs.forEach(x => Log.remove({_id: x._id})) }>Remove all</button> 
        <table>
          <tbody> { 
            take(reverse(sortBy(this.props.logs,'created_at',false)),10).map(x => 
              <tr key={x._id} style={{color: ColorHash.hex(x.user)}}>
                <td>{x.created_at}</td>
                <td>{x.user}</td>
                <td>{x.message}</td>
              </tr>
            ) 
          } </tbody>
        </table>
=======
    this.state = { form: false }
  }
  
  render() {
    return(
      <div>
        <h3>Running activity</h3>
        { this.props.currentActivity && this.props.currentActivity._id ? 
          this.props.currentActivity.data.name  :
            <i>Paused</i> }
        <h3>Activity list</h3>
        <ActivityList 
          activities = {this.props.activities} 
          setFn={ (x) => AppState.upsert( 'currentActivity', {$set: {value: x}} ) } />
        <hr />
        <LogView logstream = {this.props.log} />
>>>>>>> frogv2-2
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    logs: Logs.find({}).fetch(),
    currentActivity: objectize(AppState.findOne({}).currentActivity
  }
}, Engine)


