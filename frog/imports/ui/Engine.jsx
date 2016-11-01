import React, { Component } from 'react';
import { Act, Log, AppState } from '../api/act'
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { uuid } from 'frog-utils'
import { find, sortBy, reverse, take } from 'lodash'
import colorHash from 'color-hash'
import { objectize } from '../../lib/utils'
const ColorHash = new colorHash


import Activities from '../activities'

const ActivityList = ( { activities, setFn } ) => { return(
  <div>
  <ul>
      { activities.map(x => <li key={x._id}><a href='#' onClick={() => setFn(x)}>{x.data.name}</a></li>) }
  </ul>
  <button onClick={() => setFn({_id: null})} >Pause</button>
    </div>
)}

class Engine extends Component {
  constructor(props) {
    super(props);
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
            <tr><td>
        <h1>Running activity</h1>
        { this.getActivity() ? this.getActivity().data.name  : 'Paused' }
        </td><td>
        <h1>Activity list</h1>
        <ActivityList activities={this.props.activities} setFn={
          (x) => AppState.upsert( 'currentActivity', {$set: {value: x._id}} )
        } />
        </td></tr></tbody></table>
        <h1>Log</h1>
        <button onClick={() => this.props.log.forEach(x => Log.remove({_id: x._id})) }>Remove all</button> 
        <table>
          <tbody>
        { take(reverse(sortBy(this.props.log, 'created_at', false)),10).map(x => <tr key={x._id} style={{color: ColorHash.hex(x.user)}}><td>{x.created_at}</td><td>{x.user}</td><td>{x.message}</td></tr>) }
      </tbody>
      </table>
      </div>
    )
  }
}


export default createContainer(() => {
  return {
    activities: Act.find({}).fetch(),
    log: Log.find({}).fetch(),
    appstate: objectize(AppState.find({}).fetch())
  }
}, Engine)

