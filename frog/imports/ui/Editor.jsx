import React, { Component } from 'react';
import { Activities, Graphs } from '../api/db'
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import { uuid } from 'frog-utils'
import { sortBy, reverse, take } from 'lodash'
import { objectize } from '../../lib/utils'

import ActivityTypes from '../activities'
import Form from 'react-jsonschema-form'

const ActivityList = ( { activities } ) => { return(
  <ul> { 
    activities.map((x) => 
      <li key={x._id}>
        <button onClick={ () => Activities.remove({_id: x._id}) }>x</button>
        {x.data.name}
      </li>
    ) 
  } </ul>
)}

const ActivityTypeList = ( { activity_types } ) => {
  return(
  <ul> { 
    activity_types.map((x) => 
      <li key={x.meta.id}>
        <a href='#' onClick={() => this.setState({form: x})}>{x.meta.name}</a>
      </li>
    )
  } </ul>
)}

class ActivityBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: false,
      currentActivity: null
    }
  }

  addActivity = (type, data) => {
    this.setState({ form: null })
    Activities.insert({_id: uuid(), activity_type: type, data: data, created_at: new Date()})
  }

  render() {
    return(
      <div>
        { this.state.form ? 
          <Form 
            schema={this.state.form.config} 
            onSubmit={(data) => this.addActivity(this.state.form.meta.id, data.formData)}
            liveValidate={true} /> 
          : null 
        }
        <hr />
        <h1>Activity list</h1>
        <ActivityList activities={this.props.activities} />
        <hr />
        <h1>Add activity</h1>
        <ActivityTypeList activity_types={ActivityTypes} />
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  }
}, ActivityBody)
