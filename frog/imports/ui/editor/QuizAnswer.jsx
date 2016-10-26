import React, { Component } from 'react';


/*
Class used to display a QCM Choices
*/
export default class QuizAnswer extends Component {

  ANSWER_REF() {return "Answer "+(this.props.id+1); }

  constructor(props) {
    super(props);

    this.state = {
      answer:"",
    }
  }

  //To say if all sub-form fields have been filled
  haveFieldsCompleted() {
    return this.state.answer !== "";
  }

  //Once requested, this component generates the sub-form answer
  getAnswer() {
    return this.state.answer;
  }


  handleAnswerChange(event) {
    event.preventDefault();
    this.setState({answer:event.target.value.trim()});
  }

  render() {
    return (
      <div >
      <label>{this.ANSWER_REF()}</label><br/>
      <input
      type="text"
      ref={this.ANSWER_REF()} 
      onChange={this.handleAnswerChange.bind(this)}
      onSubmit={this.handleAnswerChange.bind(this)}/><br/>
      </div>
      );
  }

  
}
