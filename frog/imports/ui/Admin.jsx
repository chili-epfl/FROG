import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Activities } from '../api/activities.js'; 
import { Graphs } from '../api/graphs.js'; 

class Admin extends Component {

  createBasicActivities() {
    const activityItems = [
      require('../../data/activities/lecture_std_1.json'),
      require('../../data/activities/lecture_std_2.json'),
      require('../../data/activities/quiz_std_1.json'),
      require('../../data/activities/quiz_std_2.json'),
      require('../../data/activities/video_std_1.json'),
      require('../../data/activities/video_std_2.json'),
    ]

    const graphItems = [
      require('../../data/graphs/graph_std_1.json'),
      require('../../data/graphs/graph_std_2.json'),
    ]

    function insertActivityItems(item) {
      Activities.remove(item['_id']);
      Activities.insert(item);
    }

    function insertGraphItems(item) {
      Graphs.remove(item['_id']);
      Graphs.insert(item);
    }

    activityItems.forEach(insertActivityItems);
    graphItems.forEach(insertGraphItems);
  }

  renderLists(list) {
    return (
      <div>
        <h3> Activities </h3>
        <ul> {
          this.props.activities ? 
          this.props.activities.map((activity)=>(
            <li key={activity._id}>{activity._id}:{activity.type}:{activity.plane}</li>
          )) : <li>empty</li> 
        } </ul>
        <h3> Graphs </h3>
        <ul> {
          this.props.graphs ? 
          this.props.graphs.map((graph)=>(
            <li key={graph._id}>{graph._id}:{graph.name}</li>
          )) : <li>empty</li>
        } </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h2>Admin interface</h2>
        <p>Write activities in the database:</p>
        <button onClick={this.createBasicActivities.bind(this)}>click me</button>
        {this.renderLists()}
      </div>
    );
  }
}
 
Admin.propTypes = {
  activities: PropTypes.array.isRequired,
  graphs: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    graphs: Graphs.find({}).fetch(),
  };
}, Admin);