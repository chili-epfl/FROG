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
  <div>
    <h1>Activity list</h1>
    <ul> { 
      activities.map((activity) => 
        <li key={activity._id}>
          <button onClick={ () => Activities.remove({_id: activity._id}) }>x</button>
          {activity.data.name}
        </li>
      ) 
    } </ul>
  </div>
)}

const ActivityTypeList = ( { activity_types, setFn } ) => { return(
  <div>
    <h1>Add activity</h1>
    <ul> { 
      activity_types.map((activity_type) => 
        <li key={activity_type.id}>
          <a href='#' onClick={() => setFn(activity_type)}>{activity_type.meta.name}</a>
        </li>
      )
    } </ul>
  </div>
)}

const ActivityForm = ( { form, submit } ) => { return (
  <div>
    <h1>Form</h1>
    {form ? 
      <Form 
      schema={form.config} 
      onSubmit={(data) => submit(form.id, data.formData)}
      liveValidate={true} /> 
    : <p>Please chose an activity type</p>
    }
  </div>
)}

class ActivityBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: null
    }
  }

  submitAddActivity = (type, data) => {
    this.setState({ form: null })
    addActivity(type, data);
  }

  render() {
    return(
      <div>
        <ActivityForm form={this.state.form} submit={this.submitAddActivity}/>
        <ActivityList activities={this.props.activities} />
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
