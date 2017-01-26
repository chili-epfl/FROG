import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import Form from 'react-jsonschema-form'
import Dropdown from 'react-dropdown'

import { Activities, addActivity, flushActivities } from '../api/activities'
import { activityTypes } from '../activityTypes'
import { Logs } from '../api/logs'


const TypeList = ({ data, onSelect }) => {
  const options = data.map(x => ({value: x.id, label: x.meta.name }))
  const onChange = (e) => {
    const selected = data.filter(x => x.id === e.value)
    if(selected) {
      onSelect(selected[0])
    }
  }

  return(
    <Dropdown options={options} onChange={onChange} />
  )
}
  

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

  typeList = () => <TypeList 
    data={activityTypes}
    onSelect={(e) => this.setState({ form: e })}
  />

  render() {
    return (
      <div>
        {this.form()}
        {this.typeList()}
      </div>
    )
  }
}

export default createContainer(() => ({
  activities: Activities.find({}).fetch(),
  log: Logs.find({}).fetch()
}), ActivityBody)
