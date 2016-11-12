import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { sortBy, reverse, take } from 'lodash'
import Form from "react-jsonschema-form";

import { objectize } from '../../lib/utils'
import { Activities, addActivity, flushActivities } from '../api/activities'
import { activity_types } from '../activity_types'
import { Log } from '../api/log'


const ActivityList = ( { activities, setFn } ) => { 
  return(
  <div>
    <ul>
      { activities.map( x => <li key={x._id}>{x.data.name}</li>) }
    </ul>

    { activities.length > 0 ? 
      <button onClick = {flushActivities} >Remove all</button> : 
        null }
  </div>
)}

class ActivityBody extends Component {
  constructor(props) {
    super(props);
    this.state = { form: null }
  }

  submitAddActivity = (id, data) => {
    this.setState({ form: null })
    addActivity(id, data)
  }

  form = () => this.state.form ? 
    <Form 
      schema={this.state.form.config} 
      onSubmit={(data) => this.submitAddActivity(this.state.form.id, data.formData)}
      liveValidate={true} /> : 
    null

  type_list = activity_types.map((x) => 
    <li key = {x.id}>
      <a href='#' 
        onClick={() => this.setState({form: x})}>
        {x.meta.name}
      </a>
    </li>)

  render() {
    return(
      <div>
        { this.form() }
        <hr />
        <h1>Current graph</h1>
        <ActivityList activities={this.props.activities} />
        <hr />
        <h1>Add activity</h1>
        { this.type_list }
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    log: Log.find({}).fetch(),
  }
}, ActivityBody)
