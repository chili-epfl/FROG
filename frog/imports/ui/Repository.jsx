import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Activities } from '../api/activities';
import { Graphs } from '../api/graphs';

import { activity_types } from '../activity_types';

import { get } from 'lodash';
import GraphDisplay from './repository/GraphDisplay';

const activity_types_id = activity_types.map((type)=>type.id)

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

  render() { return (
    <div>
      <b onClick={this.toggleDisplay}>{this.props.activity.activity_type}:</b>
      <p> {this.props.activity.data.name}</p>
      { this.state.isClicked ?
        <pre>{JSON.stringify(this.props.activity.data, null, 2)}</pre>
        : <p></p>
      }
    </div>
  )}
}

const ActivityListDisplay = ( { activities, typeFilter } ) => { return (
  <div>
    <ul> { activities
      .filter((activity) => get(typeFilter,activity.activity_type,true))
      .map( (activity) => (
        <li key={activity._id}>
          <ActivityDisplay activity={activity} />
        </li>
    )) } </ul>
  </div>
)}

const GraphListDisplay = ( { graphs } ) => { return (
  <div>
    <ul> { graphs.map( (graph) => (
      <li key={graph._id}>
        {graph._id}:
        {graph.name}
        <GraphDisplay graph={graph}/>
      </li>
    )) } </ul>
  </div>
)}

const TypeFilterControl = ( { typeFilter, toggleFn } ) => { return (
  <div>
  { activity_types_id.map((type) =>
    <span key={type}>
      <input
        type="checkbox"
        readOnly
        checked={get(typeFilter,type,true)}
        onClick={() => toggleFn(type)}
      /> {type}
    </span>
  )}
  </div>
)}

class Repository extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter:"",
      // fields are true if undefinied
      typeFilter:{}
    }
  }

  toggleType = (type) => {
    var filter = this.state.typeFilter
    filter[type] = !get(filter,type,true)
    this.setState({typeFilter:filter})
  }

  render() {
    return (
      <div>
        <h1> Activities </h1>
        <TypeFilterControl typeFilter={this.state.typeFilter} toggleFn={this.toggleType} />
        <ActivityListDisplay activities={this.props.activities} typeFilter={this.state.typeFilter} />
        <h1> Graphs </h1>
        <GraphListDisplay graphs={this.props.graphs} />
      </div>
    );
  }
}

Repository.propTypes = {
  activities: PropTypes.array.isRequired,
  graphs: PropTypes.array.isRequired
};

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    graphs: Graphs.find({}).fetch()
  };
}, Repository);
