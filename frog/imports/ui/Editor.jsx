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

  addActivity(type, data) {
    this.setState({ form: null })
    addActivity(type, data);
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
        <ActivityTypeList activity_types={activity_types} />
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  }
}, ActivityBody)
