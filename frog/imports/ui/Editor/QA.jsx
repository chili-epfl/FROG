import React, { Component } from 'react';
 
export default class EditorTest extends Component {

constructor(props) {
    super(props);

    QUESTION_REF = "Question";
    CHOICES_REF = "Choices";
    ANSWER_REF = "Answer";

    this.state = {
      question:"",
      choices:"",
      answer:"",
    }
  }

  generateQA() {
    var text = {question: this.state.question,
                choices: this.state.choices,
                answer: this.state.answer,}

    /*
    var text = "question:" + this.state.question + "\n" +
              "choices:" + this.state.choices + "\n" +
              "answer:" + this.state.answer + "\n";
              */
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
        <label>{QUESTION_REF}</label><br/>
        <input
          type="text"
          ref={QUESTION_REF} 
          onChange={this.handleQuestionChange.bind(this)}
          onSubmit={this.handleQuestionChange.bind(this)}/><br/>

        <label>{CHOICES_REF}</label><br/>
        <input
          type="text"
          ref={CHOICES_REF}
          onChange={this.handleChoicesChange.bind(this)}
          onSubmit={this.handleChoicesChange.bind(this)}/><br/>

        <label>{ANSWER_REF}</label><br/>
        <input
          type="text"
          ref={ANSWER_REF}
          onChange={this.handleAnswerChange.bind(this)}
          onSubmit={this.handleAnswerChange.bind(this)}/><br/>
      </div>
    );
  }

	
}
