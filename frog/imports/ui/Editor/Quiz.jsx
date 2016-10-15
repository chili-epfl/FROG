import React, { Component } from 'react';
 

/*
Class used to display a QCM
*/
export default class Quiz extends Component {

  //class constants, in functions
  QUESTION_REF() {return "Question "+(this.props.id+1); }
  CHOICES_REF() {return "Choices "+(this.props.id+1); }
  ANSWER_REF() {return "Answer "+(this.props.id+1); }

  constructor(props) {
      super(props);

      this.state = {
        question:"",
        choices:"",
        answer:"",
      }
    }

  //To say if all sub-form fields have been filled
  haveFieldsCompleted() {
    return this.state.question !== "" && this.state.choices !== "" && this.state.answer !== "";
  }

  //Once requested, this component generates the sub-form answer
  generateQuiz() {
    var text = {question: this.state.question,
                choices: this.state.choices,
                answer: this.state.answer,}
    return text;
  }

  handleQuestionChange(event) {
    event.preventDefault();
    this.setState({question:event.target.value});
  }

  handleChoicesChange(event) {
    event.preventDefault();
    this.setState({choices:event.target.value});
  }

  handleAnswerChange(event) {
    event.preventDefault();
    this.setState({answer:event.target.value});
  }

  render() {
    return (
      <div >
        <label>{this.QUESTION_REF()}</label><br/>
        <input
          type="text"
          ref={this.QUESTION_REF()} 
          onChange={this.handleQuestionChange.bind(this)}
          onSubmit={this.handleQuestionChange.bind(this)}/><br/>

        <label>{this.CHOICES_REF()}</label><br/>
        <input
          type="text"
          ref={this.CHOICES_REF()}
          onChange={this.handleChoicesChange.bind(this)}
          onSubmit={this.handleChoicesChange.bind(this)}/><br/>

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
