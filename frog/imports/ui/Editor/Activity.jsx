import React, { Component } from 'react';
import ActivityType from './ActivityType.jsx';

/*
Class used to display the form to create a new activity
*/
export default class Activity extends Component {

  LECTURE_TYPE() { return "Lecture"; }
  QUIZ_TYPE() { return "Quiz"; }
  VIDEO_TYPE() { return "Video"; }

  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      type: this.LECTURE_TYPE(),
      plane: 1,
    }
  }

  //To say if all form fields have been filled
  haveFieldsCompleted() {
    return this.state.id !== ""
    && this.state.name !== ""
    && this.refs.activityType.haveFieldsCompleted();
  }

  areAnswersInChoices() {
    return this.refs.activityType.areAnswersInChoices();
  }


  handleIDChange(event) {
    event.preventDefault();
    this.setState({id:event.target.value.trim()});
  }

  handleNameChange(event) {
    event.preventDefault();
    this.setState({name:event.target.value.trim()});
  }

  handleTypeChange(event) {
    event.preventDefault();
    this.setState({type:event.target.value});
    this.refs.activityType.setState({listQuiz:[]});
  }

  handlePlaneChange(event) {
    event.preventDefault();
    this.setState({plane:event.target.value});
  }

  //Once requested, this component generates the whole form answer
  generateActivity() {
    var text =   {_id: this.state.id,
     type: this.state.type,
     name: this.state.name,
     plane: this.state.plane,
     object: this.refs.activityType.generateAnswers(), };
     return text;
   }

   render() {
     return(
      <div>
        <form>
          <label>ID</label><br/>
          <textarea
            type="text"
            ref="id"
            onChange={this.handleIDChange.bind(this)}
            onSubmit={this.handleIDChange.bind(this)}/>
          <br/><br/>

          <label>Name</label><br/>
          <textarea
            type="text"
            ref="name"
            onChange={this.handleNameChange.bind(this)}
            onSubmit={this.handleNameChange.bind(this)}/>
          <br/><br/>

          <label>Plane</label><br/>
          <select ref="plane" defaultValue={1} onChange={this.handlePlaneChange.bind(this)}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          </select><br/><br/>

          <label>Type</label><br/>
          <select ref="type" defaultValue={this.LECTURE_TYPE()} onChange={this.handleTypeChange.bind(this)}>
          <option value={this.LECTURE_TYPE()}>{this.LECTURE_TYPE()}</option>
          <option value={this.QUIZ_TYPE()}>{this.QUIZ_TYPE()}</option>
          <option value={this.VIDEO_TYPE()}>{this.VIDEO_TYPE()}</option>
          </select><br/><br/>

        </form>

      <ActivityType
        ref="activityType" type={this.state.type}
        LECTURE_TYPE={this.LECTURE_TYPE()}
        QUIZ_TYPE={this.QUIZ_TYPE()}
        VIDEO_TYPE={this.VIDEO_TYPE()}/>

      </div>
      )
   }
 }
