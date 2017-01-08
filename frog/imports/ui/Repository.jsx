import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'

import { get } from 'lodash'

import { Activities } from '../api/activities'
import { Graphs } from '../api/graphs'
import { activityTypes } from '../activityTypes'

import GraphDisplay from './repository/GraphDisplay';

const activityTypesId = activityTypes.map((type) => type.id)

class ActivityDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isClicked: false
    }
  }

  toggleDisplay = (event) => {
    event.preventDefault()
    this.setState({
      isClicked: !this.state.isClicked
    })
  }

  render() {
    return (
      <div>
        <a href={'#'} onClick={this.toggleDisplay}>{this.props.activity.activityType}:</a>
        <p> {this.props.activity.data.name}</p>
        { this.state.isClicked ?
          <pre>{JSON.stringify(this.props.activity.data, null, 2)}</pre>
          : <p />
        }
      </div>
    )
  }
}

const ActivityListDisplay = ({ activities, typeFilter }) =>
  <div>
    <ul> {(activities
      .filter((activity) => get(typeFilter, activity.activityType, true))
      .map((activity) => (
        <li key={activity._id}>
          <ActivityDisplay activity={activity} />
        </li>
      )
    ))} </ul>
  </div>

const GraphListDisplay = ({ graphs }) =>
  <div>
    <ul> { graphs.map((graph) => (
      <li key={graph._id}>
        {graph._id}:
        {graph.name}
        <GraphDisplay graph={graph}/>
      </li>
    )) } </ul>
  </div>

const TypeFilterControl = ({ typeFilter, toggleFn }) =>
  <div>
    { activityTypesId.map((type) =>
      <span key={type}>
        <input
          type='checkbox'
          readOnly
          checked={get(typeFilter, type, true)}
          onClick={() => toggleFn(type)}
        /> {type}
      </span>
    )}
  </div>

class Repository extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameFilter: '',
      // fields are true if undefinied
      typeFilter: {}
    }
  }

  toggleType = (type) => {
    const filter = this.state.typeFilter
    filter[type] = !get(filter, type, true)
    this.setState({ typeFilter: filter })
  }

  render() {
    return (
      <div>
        <h1> Activities </h1>
        <TypeFilterControl
          typeFilter={this.state.typeFilter}
          toggleFn={this.toggleType}
        />
        <ActivityListDisplay
          activities={this.props.activities}
          typeFilter={this.state.typeFilter}
        />
        <h1> Graphs </h1>
        <GraphListDisplay
          graphs={this.props.graphs}
        />
      </div>
    )
  }
}

export default createContainer(() => {
  const activities = Activities.find({}).fetch()
  const graphs = Graphs.find({}).fetch()
  return ({ activities, graphs })
}, Repository)
