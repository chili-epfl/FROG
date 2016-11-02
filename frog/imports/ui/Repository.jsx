import React, { Component, PropTypes } from 'react';
import { Activities, Graphs } from '../api/db';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

class Repository extends Component {

  render() {
    return (
      <div>
        <h1> Activities </h1>
        <ul> {
          this.props.activities.map((activity)=>(
            <li key={activity._id}>
              <b>{activity.activity_type}:</b><p> {activity.data.name}</p>
              <pre>{JSON.stringify(activity.data, null, 2)}</pre>
            </li>
          ))
        } </ul>
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
};

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    graphs: Graphs.find({}).fetch()
  };
}, Repository);
