import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { uuid } from 'frog-utils';
import { find, sortBy, reverse, take } from 'lodash';
import colorHash from 'color-hash';
import { objectize } from '../../lib/utils';

import { Sessions, addSession, updateSessionState, updateSessionActivity } from '../api/sessions';
import { Activities, Operators, addResult } from '../api/activities';
import { Graphs } from '../api/graphs';
import { Logs, flushLogs } from '../api/logs';
import { Products } from '../api/products';

import { activity_types_obj } from '../activity_types';
import { operator_types_obj } from '../operator_types';

const ColorHash = new colorHash

const setTeacherSession = (session_id) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.controlSession':session_id}})
}

// check if there are any operators, and run these first
const runProduct = (sessionid, activityid) => {
  const ops = Operators.find({to: activityid, type: 'product'}, {reactive: false}).fetch()
  if(ops.length > 0) {
    const op = ops[0]
    const operator_type = operator_types_obj[op.operator_type]
    const prod = Products.find({activity_id: op.from}, {reactive: false}).fetch()
    if(prod.length > 0) {
      const result = operator_type.operator(op.data, prod)
      addResult('product', activityid, result)
      console.log('product', result)
    }
  }
}

const runSocial = (sessionid, activityid) => {
  const ops = Operators.find({to: activityid, type: 'social'}, {reactive: false}).fetch()
  if(ops.length > 0) {
    const op = ops[0]
    const operator_type = operator_types_obj[op.operator_type]
    const prod = Products.find({activity_id: op.from}, {reactive: false}).fetch()
    if(prod.length > 0) {
      const result = operator_type.operator(op.data, prod)
      addResult('social', activityid, result)
      console.log('social', result)
    }
  }
}

const switchActivity = (sessionid, activityid) => {
  runProduct(sessionid, activityid)
  runSocial(sessionid, activityid)
  updateSessionActivity(sessionid,activityid)
}

const SessionController = createContainer(
  ( { session } ) => { return({
    session: session,
    activities: (session ? Activities.find({ graphId: session.graphId }).fetch() : null)
  })}, 
  ( { session, activities } ) => { return(
    session ? 
      <div>
        <h3>Session control</h3>
        Current state <b>{session.state}</b>. Control the session through selecting an activity below, or Starting/Pausing/Stopping the session.
        <h4>Available activities</h4>
        <ul> { 
          activities.map((activity) => {
            const running = (activity._id == session.activity)
            return (
            <li key={activity._id}>
              <a href='#' onClick={() => switchActivity(session._id,activity._id)}>
                {!!activity.data && activity.data.name} - <i>{activity.activity_type}</i> {!!running && <i> (running)</i>}
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
  )}
)

class SessionList extends Component { 
  constructor(props){
    super(props)
    this.state={
      graph: this.props.graphs[0] ? this.props.graphs[0]._id : null
    }
  }

  changeGraph = (event) => {
    event.preventDefault()
    this.setState({ graph: event.target.value })
  }

  submitAddSession = (event) => {
    event.preventDefault() 
    addSession(this.state.graph) 
  }

  render() { return(
    <div>
      <h3>Session list</h3> 
      <select onChange={this.changeGraph}>
        {this.props.graphs.map(graph => <option key={graph._id} value={graph._id} >{graph.name}</option>)}
      </select>
      <button className='btn btn-primary btn-sm' onClick={this.submitAddSession} >Add session</button>
      <ul> { 
        this.props.sessions.map((session) => 
          <li key={session._id}>
            <a href='#' onClick={() => Sessions.remove({_id:session._id})}>
              <i className="fa fa-times"></i>
            </a>
            <a href='#' onClick={ () => setTeacherSession(session._id) }>
              <i className="fa fa-pencil"></i>
            </a>
            {session._id}
          </li>
        ) 
      } </ul>
    </div>
  )}
}

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

export default createContainer(
  () => {
    const user = Meteor.users.findOne({_id:Meteor.userId()})
    const session = user.profile ? Sessions.findOne({_id:user.profile.controlSession}) : null
    return {
      sessions: Sessions.find().fetch(),
      session: session,
      graphs: Graphs.find().fetch(),
      logs: Logs.find({}, {sort:{created_at: -1}, limit: 100}).fetch(),
      user: user
    }
  }, 
  ( { graphs, session, sessions, logs, user } ) =>
    <div>
      <SessionController session={session} />
      <DashView user={user} logs={logs} />
      <SessionList sessions={sessions} graphs={graphs} />
    </div>
)
