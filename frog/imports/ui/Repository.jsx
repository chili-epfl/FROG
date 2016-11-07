import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Activities } from '../api/activities';
import { Graphs } from '../api/graphs';

class ActivityDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isClicked: false,
    }
  }

  toggleDisplay = (event) => {
    event.preventDefault();
    this.setState({
      isClicked: !this.state.isClicked,
    });
  }

  render() { return (
    <div>
      <b onClick={this.toggleDisplay}>{this.props.activity.activity_type}:</b>
      <p> {this.props.activity.data.name}</p>
      { this.state.isClicked ?
        <pre>{JSON.stringify(this.props.activity.data, null, 2)}</pre>
        : null
      }
    </div>
  )}
}

class Repository extends Component {

  render() {
    return (
      <div>
        <h1> Activities </h1>
        <ul> { this.props.activities.map( (activity) => (
          <li key={activity._id}>
            <ActivityDisplay activity={activity} />
          </li>
        ))} </ul>
        <h1> Graphs </h1>
        <ul> {
          this.props.graphs.map((graph)=>(
            <li key={graph._id}>
              {graph._id}:
              {graph.name}
            </li>
          ))
        } </ul>
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
