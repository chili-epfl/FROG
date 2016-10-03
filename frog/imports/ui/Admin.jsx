import React, { Component } from 'react';
 
export default class Admin extends Component {

  createBasicActivities() {
    console.log("creating activities");
  }

  render() {
    return (
      <div>
        <h2>Admin interface</h2>
        <p>Write activities in the database:</p>
        <button onClick={this.createBasicActivities.bind(this)}>click me</button>
      </div>
    );
  }
}
