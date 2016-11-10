import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import Form from 'react-jsonschema-form'

import { Activities, addActivity } from '../api/activities';
import { Graphs } from '../api/graphs';import { Meteor } from 'meteor/meteor';

import { uuid } from 'frog-utils'
import { sortBy, reverse, take } from 'lodash'
import { objectize } from '../../lib/utils'

import { activity_types, activity_types_obj } from '../activity_types';

const ActivityList = ( { activities, setFn } ) => { 
  
  return(
    <div>
      <h1>Activity list</h1>
      <ul> { 
        activities.map((activity) => 
          <li style={{listStyle: 'none'}} key={activity._id}>
            <a href='#' onClick={ () => Activities.remove({_id: activity._id}) }>
              <i className="fa fa-times" />
            </a>
            &nbsp;
            <a href='#' onClick={ () => setFn(activity.activity_type, activity) } >
              <i className="fa fa-pencil" />
            </a>
            &nbsp;
            {activity.data.name} <i>({activity.activity_type})</i>
          </li>
        ) 
      } 
    </ul>
  </div>
  )
}

const ActivityTypeList = ( { activity_types, setFn } ) => { return(
  <div>
    <h1>Add activity</h1>
    <ul> { 
      activity_types.map((activity_type) => 
        <li key={activity_type.id} style={{listStyle: 'none'}} >
          <a href='#' onClick={() => setFn(activity_type.id)}>

<i className="fa fa-plus"></i>&nbsp;
</a>
            {activity_type.meta.name}
        </li>
      )
    } </ul>
  </div>
)}

const ActivityForm = ( { form, submit, existing } ) => { 
  const existing_id = existing ? existing._id : null 
  return (
  <div>
    {form ? 
      <Form 
      schema={activity_types_obj[form].config} 
      onSubmit={(data) => submit(form, data.formData, existing_id)}
      formData={existing ? existing.data : {}}
      liveValidate={true} /> 
    : <p>Please chose an existing activity to edit or an activity type to add a new activity</p>
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

  submitAddActivity = (type, data, id) => {
    this.setState({ form: null })
    addActivity(type, data, id)
  }

  setFn = (form, existing) =>
    this.setState({form: form, existing: existing})

  render() {
    return(
      <div>
        <ActivityForm form={this.state.form} existing={this.state.existing} submit={this.submitAddActivity}/>
        <ActivityList activities={this.props.activities} setFn={this.setFn} />
        <ActivityTypeList activity_types={activity_types} setFn={this.setFn} />
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  }
}, ActivityBody)
