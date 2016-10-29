import React, { Component } from 'react';


/*
Class used to display a MCQ Choices
*/
export default class QuizChoice extends Component {

  CHOICE_REF() {return "Choice "+(this.props.id+1); }

  //To say if all sub-form fields have been filled
  haveFieldsCompleted() {
    return this.refs[this.CHOICE_REF()].value.trim() !== "";
  }

  //Once requested, this component generates the sub-form answer
  getChoice() {
    return this.refs[this.CHOICE_REF()].value.trim();
  }

  render() {
    return (
      <div >
        <label>{this.CHOICE_REF()}</label><br/>
        <input
          type="text"
          ref={this.CHOICE_REF()} />
        <button
          type="delete"
          onClick={this.props.callBack.bind(this, this.props.refID)}>&times;</button>
      </div>
      );
  }
}
