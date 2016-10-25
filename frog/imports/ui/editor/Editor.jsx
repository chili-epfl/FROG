import React, { Component } from 'react';
import Activity from './Activity.jsx';
import { Activities } from '../../api/activities.js';

export default class Editor extends Component {

  //For now, we show the result of the form with an alert, but of course it'll be then added to the database.
  handleSubmit() {
    if(!this.refs.newActivity.haveFieldsCompleted()) {
      alert("Not all fields have been filled.");
    }
    else if(!this.refs.newActivity.areAnswersInChoices()){
      alert("Not all answers are in the choices.");
    }
    else if(Activities.find({"_id":this.refs.newActivity.state.id}).count() != 0) {
      alert("An activity with a similar id already exists. You have to change it.");
    }
    else {
      var item = this.refs.newActivity.generateActivity();
      Activities.remove(item['_id']);
      Activities.insert(item);
      alert("Your actitvity has been added in the repository.");
    }
  }

  render() {
    return(
      <div>
        <h2>Insert a new Activity:</h2>
        <Activity ref="newActivity" />
        <button
          type="submit"
          onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    )
  }

}
 
