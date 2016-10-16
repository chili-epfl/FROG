import React, { Component } from 'react';
import QuizChoice from './QuizChoice.jsx';


/*
Class used to display a QCM
*/
export default class Quiz extends Component {

  //class constants, in functions
  QUESTION_REF() {return "Question "+(this.props.id+1); }
  ANSWER_REF() {return "Answer " +(this.props.id+1); }

  constructor(props) {
    super(props);

    this.state = {
      question:"",
      answer:"",
      show: true,
      listChoices:[],
    }
  }

  //To avoid problems with unbounded number of choices
  tooManyChoices() {
    return this.state.listChoices.length >= 5;
  }

  enoughChoices() {
    return this.state.listChoices.length > 0;
  }


  //Used to delete a choice, when delete button is hit. Deletes only last choice created.
  deleteChoice(event) {
    event.preventDefault();

    if(this.enoughChoices()) {
      var allChoices = this.state.listChoices.slice(0, this.state.listChoices.length - 1);
      this.setState({listChoices:allChoices});
    }
  }

  //Used to create a choice, when create button is hit. Creates only in the end of the list of choices.
  createChoice(event) {
    event.preventDefault();

    if(!this.tooManyChoices()) {
      var allChoices = this.state.listChoices.concat(("Choice" + this.state.listChoices.length));
      this.setState({listChoices:allChoices});
    }

  }

  //Once requested, this component generates the form answer of all choices
  generateChoicesAnswers() {

    var choices = this.state.listChoices.map((ref) => {
      var choice = (this.refs[ref]);
      return choice.getChoice();
    });

    return choices;
  }

  renderAllChoices() {
    return(
      <div>
      {this.state.listChoices.map((ref, i) => <QuizChoice ref={ref} key={ref} id={i} />)}
      </div>
      );
  }

  //To say if all sub-form fields have been filled
  haveFieldsCompleted() {

    var choicesFieldsCompleted = (this.state.listChoices.length !== 0);

    this.state.listChoices.forEach((ref) => {
      var choice = (this.refs[ref]);
      choicesFieldsCompleted = choicesFieldsCompleted && choice.haveFieldsCompleted();
    });

    return this.state.question !== "" && choicesFieldsCompleted && this.state.answer !== "";
  }

  isAnswerInChoices() {

    var answerInChoices = false;
    this.state.listChoices.forEach((ref) => {
      var choice = (this.refs[ref]);
      answerInChoices = answerInChoices || (this.state.answer === choice.getChoice());
    });
    return answerInChoices;
  }

  isDeleted() {
    return !this.state.show;
  }

  //Once requested, this component generates the sub-form answer
  generateQuiz() {
    var text = {question: this.state.question,
      choices: this.generateChoicesAnswers(),
      answer: this.state.answer,}
      return text;
    }

  deleteQuiz(event) {
    event.preventDefault(event);

    this.setState({show:!this.state.show});
  }

    handleQuestionChange(event) {
      event.preventDefault();
      this.setState({question:event.target.value.trim()});
    }

    handleAnswerChange(event) {
      event.preventDefault();
      this.setState({answer:event.target.value.trim()});
    }

    render() {
      return (

        this.state.show ? (
        <div >
        <fieldset>
        <label>{this.QUESTION_REF()}</label><br/>
        <input
        type="text"
        ref={this.QUESTION_REF()}
        onChange={this.handleQuestionChange.bind(this)}
        onSubmit={this.handleQuestionChange.bind(this)}/>
        <button ref="delete" onClick={this.deleteQuiz.bind(this)}>Delete</button><br/>



        <div>
        <button
        type="submit"
        onClick={this.createChoice.bind(this)}
        disabled={this.tooManyChoices()}>Create new Choice</button><br/><br/>
        {this.renderAllChoices()}<br/>
        <button
        type="submit"
        onClick={this.deleteChoice.bind(this)}
        disabled={!this.enoughChoices()}>Delete last Choice</button>
        </div>
        <br/>

        <label>{this.ANSWER_REF()}</label><br/>
        <input
        type="text"
        ref={this.ANSWER_REF()}
        onChange={this.handleAnswerChange.bind(this)}
        onSubmit={this.handleAnswerChange.bind(this)}/><br/>
        </fieldset>
        </div>
      ): <div/>
      );
    }


  }
