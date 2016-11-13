import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import Form from 'react-jsonschema-form'
import ReactDOM from 'react-dom';

import { Activities, addActivity } from '../api/activities';
import { Graphs } from '../api/graphs';import { Meteor } from 'meteor/meteor';

import { uuid } from 'frog-utils'
import { sortBy, reverse, take } from 'lodash'
import { objectize } from '../../lib/utils'

import { activity_types } from '../activity_types';

import Draggable, {DraggableCore} from 'react-draggable';

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

const GraphDisplay = () => { return(
  <div>
    <svg width="100%" height="200px" xmlns="http://www.w3.org/2000/svg" style={{overflow: "scroll"}}>
      <text x="0%" y="10%">Plane 1</text>
      <line x1="10%" y1="10%" x2="100%" y2="10%" style={{stroke: 'black', strokeWidth:"2"}} />

      <text x="0%" y="50%">Plane 2</text>
      <line x1="10%" y1="50%" x2="100%" y2="50%" style={{stroke: 'black', strokeWidth:"2"}}/>

      <text x="0%" y="90%">Plane 3</text>
      <line x1="10%" y1="90%" x2="100%" y2="90%" style={{stroke: 'black', strokeWidth:"2"}}/>
    </svg>
  </div>
)}

const ActivityDraggableList = ( {activities, dimensions} ) => { return(
  <div>
      {activities.map((activity, index) => 
        <Draggable grid={[20, 20]} key={activity._id} bounds={dimensions}>
          <div>
            <div>{activity.data.name}</div>
          </div>
        </Draggable>
      ) 
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
        <GraphDisplay />
        <ActivityDraggableList activities = {this.props.activities} dimensions={{top: -100, left: -100, right: 100, bottom: 100}} />
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  }
}, ActivityBody)
