import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Activities } from '../api/activities.js'; 

export default class Admin extends Component {

  createBasicActivities() {
    console.log("creating activities");
    Activities.insert(require('../../data/activities/lecture_std_1.json'));
    Activities.insert(require('../../data/activities/lecture_std_2.json'));
    Activities.insert(require('../../data/activities/quizz_std_1.json'));
    Activities.insert(require('../../data/activities/quizz_std_2.json'));
    Activities.insert(require('../../data/activities/video_std_1.json'));
    Activities.insert(require('../../data/activities/video_std_2.json'));
  }

  renderList() {
    return (
      this.props.activities ? 
      this.props.activities.map((activity)=>(
        <li key={activity._id}>{activity._id}:{activity.type}:{activity.plane}</li>
      )) : <li>empty</li>
    );
  }

  render() {
    return (
      <div>
        <h2>Admin interface</h2>
        <p>Write activities in the database:</p>
        <button onClick={this.createBasicActivities.bind(this)}>click me</button>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    );
  }
}
 
Admin.propTypes = {
  activities: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  };
}, Admin);