import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import Form from 'react-jsonschema-form'

import { Activities, addActivity } from '../api/activities';
import { Graphs } from '../api/graphs';import { Meteor } from 'meteor/meteor';

import { uuid } from 'frog-utils'
import { sortBy, reverse, take } from 'lodash'
import { objectize } from '../../lib/utils'

import { activity_types } from '../activity_types';

const ActivityList = ( { activities } ) => { return(
  <ul> { 
    activities.map((activity) => 
      <li key={activity._id}>
        <button onClick={ () => Activities.remove({_id: activity._id}) }>x</button>
        {activity.data.name}
      </li>
    ) 
  } </ul>
)}

const ActivityTypeList = ( { activity_types, setFn } ) => {
  return(
  <ul> { 
    activity_types.map((activity_type) => 
      <li key={activity_type.id}>
        <a href='#' onClick={() => setFn(activity_type)}>{activity_type.meta.name}</a>
      </li>
    )
  } </ul>
)}

const ActivityForm = ( { form, submit } ) => { return (
  form ? 
    <Form 
      schema={form.config} 
      onSubmit={(data) => submit(form.id, data.formData)}
      liveValidate={true} /> 
  : <p>Please chose an activity type</p>
)}

class ActivityBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: null
    }
  }

  submitAddActivity(type, data) {
    this.setState({ form: null })
    addActivity(type, data);
  }

  render() {
    return(
      <div>
        <h1>Form</h1>
        <ActivityForm form={this.state.form} submit={this.submitAddActivity.bind(this)}/>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        <hr />
        <h1>Activity list</h1>
        <ActivityList activities={this.props.activities} />
        <hr />
        <h1>Add activity</h1>
        <ActivityTypeList activity_types={activity_types} setFn={(form) => this.setState({form:form})} />
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  }
}, ActivityBody)
