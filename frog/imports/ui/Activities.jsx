import React, { Component } from 'react';
import { Act, Log } from '../api/act'
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { uuid } from 'frog-utils'
import { sortBy, reverse, take } from 'lodash'
import { objectize } from '../../lib/utils'

import Activities from '../activities'
import Form from "react-jsonschema-form";

const getActivity = (id) => Activities.filter(x => x.meta.id == id)[0]

const RunActivity = ( { activity } ) => {
  runActivity = getActivity(activity.activity_type)
  return(<runActivity.activity config = { activity.data } logger={createLogger({activity: activity._id, user: Meteor.userId()}) }/>)
}

const createLogger = (merge) => { 
  logger = (x) => {
    logentry = {...merge, _id: uuid(), created_at: Date(), message: x}
    Log.insert(logentry)
  }
  return logger
}

const ActivityList = ( { activities, setFn } ) => { return(
  <ul>
      { activities.map(x => <li key={x._id}>{x.data.name}</li>) }
      { activities.length > 0 ? <button onClick={ () => activities.forEach(x => Act.remove({_id: x._id})) }>Remove all</button> : null }
  </ul>
)}

class ActivityBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: false,
      currentActivity: null
    }
  }

  addActivity = (id, data) => {
    this.setState({ 
      form: null
    })
    Act.insert({_id: uuid(), activity_type: id, data: data, created_at: new Date()})
  }

  render() {
    return(
      <div>
        { this.state.form ? <Form schema={this.state.form.config} onSubmit={(data) => this.addActivity(this.state.form.meta.id, data.formData)}
            liveValidate={true} /> : null }
          <hr />
        <h1>Activity list</h1>
        <ActivityList activities={this.props.activities} setFn={(x) => this.setState({currentActivity: x})} />
        <hr />
        <h1>Add activity</h1>
      {Activities.map((x) => 
        <li key={x.meta.id}><a href='#' onClick={() => this.setState({form: x})}>{x.meta.name}</a></li>)}
      </div>
    )
  }
}


export default createContainer(() => {
  return {
    activities: Act.find({}).fetch(),
    log: Log.find({}).fetch(),
  }
}, ActivityBody)
