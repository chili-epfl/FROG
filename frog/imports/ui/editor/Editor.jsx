import React, { Component } from 'react';
import Activity from './Activity.jsx';

export default class Editor extends Component {

  //For now, we show the result of the form with an alert, but of course it'll be then added to the database.
  handleSubmit() {
    if(!this.refs.newActivity.haveFieldsCompleted()) {
      alert("Not all fields have been filled !");
    }
    else if(!this.refs.newActivity.areAnswersInChoices()){
      alert("Not all answers are in the choices !");
    }
    else {
      alert(JSON.stringify(this.refs.newActivity.generateActivity()));
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
