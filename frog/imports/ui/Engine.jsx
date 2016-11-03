import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { chain, sortBy, reverse, take } from 'lodash'
import colorHash from 'color-hash'
import { uuid } from 'frog-utils'

import { objectize } from '../../lib/utils'
import { activity_types } from '../api/activities'
import { AppState } from '../api/appstate'
import { Activities } from '../api/activities'
import { Log, flushLogs } from '../api/log'

const ColorHash = new colorHash

const Activity = ({ data, setFn }) => 
  <li key = {data._id}>
    <a href='#' onClick={ () => setFn() }>
      {data.data.name}
    </a>
  </li>

const ActivityList = ({ activities, setFn }) =>  
  <div>
    <ul>
      { activities.map(x => <Activity data = {x} key = {x._id} setFn = {() => setFn(x)} />) }
    </ul>

    <button onClick={() => setFn({_id: null})} >Pause</button>
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


class Engine extends Component {
  constructor(props) {
    super(props);
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
      </div>
    )
  }
}


export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    log: Log.find({}).fetch(),
    currentActivity: objectize(AppState.find({}).fetch()).currentActivity
  }
}, Engine)

