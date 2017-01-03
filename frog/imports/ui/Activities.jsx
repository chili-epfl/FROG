import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import Form from 'react-jsonschema-form'

import { Activities, addActivity, flushActivities } from '../api/activities'
import { activityTypes } from '../activityTypes'
import { Log } from '../api/log'


const ActivityList = ({ activities }) => (
  <div>
    <ul> {activities.map(
      (activity) => <li key={activity._id}>{activity.data.name}</li>)
    } </ul>
    { activities.length > 0 ?
      <button onClick={flushActivities} >Remove all</button> : null
    }
  </div>
)

class ActivityBody extends Component {
  constructor(props) {
    super(props);
    this.state = { form: null }
  }

  submitAddActivity = (id, data) => {
    this.setState({ form: null })
    addActivity(id, data)
  }

  form = () => (this.state.form ?
    <Form
      schema={this.state.form.config}
      onSubmit={(data) => this.submitAddActivity(this.state.form.id, data.formData)}
      liveValidate
    />
    : null
  )

  typeList = activityTypes.map((activityType) => (
    <li key={activityType.id}>
      <a href='#' onClick={() => this.setState({ form: activityType })}>
        {activityType.meta.name}
      </a>
    </li>
  ))

  render() {
    return (
      <div>
        {this.form()}
        <h1>Current graph</h1>
        <ActivityList activities={this.props.activities} />
        <h1>Add activity</h1>
        {this.typeList}
      </div>
    )
  }
}

export default createContainer(() => ({
  activities: Activities.find({}).fetch(),
  log: Log.find({}).fetch()
}), ActivityBody)
