import React, { Component } from 'react';
import Act from '../api/act'
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Activities from '../activities'
import Form from "react-jsonschema-form";

const RunActivity = ( { activity } ) => {
  return(<activity.activity.activity config = { activity.data } />)
}

const ActivityList = ( { activities, setFn } ) => { return(
  <ul>
      { activities.map(x => <li><a href='#' onClick={() => setFn(x)}>{x.data.name}</a></li>) }
  </ul>
)}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: false,
      activities: [],
      currentActivity: null
    }
  }

  addActivity = (activity, data) => {
    this.setState({ 
      activities: [...this.state.activities, {activity: activity, data: data}] ,
      form: null
    })
    console.log(this.state)
  }

  render() {
    return(
      <div>
        <h1>Running activity</h1>
        { this.state.currentActivity ? <RunActivity activity={this.state.currentActivity} />: null } 
        <hr />
        <h1>Activity list</h1>
        <ActivityList activities={this.state.activities} setFn={(x) => this.setState({currentActivity: x})} />
        <hr />
        <h1>Add activity</h1>
        { this.state.form ? <Form schema={this.state.form.config} onSubmit={(data) => this.addActivity(this.state.form, data.formData)}
            liveValidate={true} /> : null }
      {Activities.map((x) => 
        <li key={x.meta.id}><a href='#' onClick={() => this.setState({form: x})}>{x.meta.name}</a></li>)}
      </div>
    )
  }
}

