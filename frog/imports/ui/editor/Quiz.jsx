import React, { Component } from 'react';
import QuizChoice from './QuizChoice.jsx';


/*
Class used to display a MCQ
*/
export default class Quiz extends Component {

  //class constants, in functions
  QUESTION_REF() {return "Question "+(this.props.id+1); }
  ANSWER_REF() {return "Answer " +(this.props.id+1); }

  constructor(props) {
    super(props);

    this.state = {
      nbChoice: 0, //need this to have unique keys
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

  //Used to create a choice, when create button is hit. Creates only in the end of the list of choices.
  createChoice(event) {
    event.preventDefault();

    if(!this.tooManyChoices()) {
      var allChoices = this.state.listChoices.concat(("Choice" + this.state.nbChoice));
      this.setState({listChoices:allChoices, nbChoice: this.state.nbChoice + 1});
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
        {this.state.listChoices.map((ref, i) =>
        <QuizChoice
          ref={ref}
          key={ref}
          id={i}
          refID={ref}
          callBack={this.deleteChoice.bind(this)}/>)}
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

    return this.refs[this.QUESTION_REF()].value.trim() !== ""
      && choicesFieldsCompleted && this.refs[this.ANSWER_REF()].value.trim() !== "";
  }

  isAnswerInChoices() {

    var answerInChoices = false;
    this.state.listChoices.forEach((ref) => {
      var choice = (this.refs[ref]);
      answerInChoices = answerInChoices
        || (this.refs[this.ANSWER_REF()].value.trim() === choice.getChoice());
    });
    return answerInChoices;
  }

  //Keep only the unselected choices
  deleteChoice(id) {
    event.preventDefault();
    var newChoiceList = this.state.listChoices.filter((ref) =>{
      var choice = (this.refs[ref]);
      return choice.props.refID != id;
    });

    this.setState({listChoices: newChoiceList});

  }

  //Once requested, this component generates the sub-form answer
  generateQuiz() {
    var text = {question: this.refs[this.QUESTION_REF()].value.trim(),
      choices: this.generateChoicesAnswers(),
      answer: this.refs[this.ANSWER_REF()].value.trim()};

    return text;
  }

  render() {
    return (
      <div >
        <fieldset>
          <label>{this.QUESTION_REF()}</label>
          <button
            type="delete"
            onClick={this.props.callBack.bind(this, this.props.refID)}>
            &times;
          </button>

          <br/>
          <input
            type="text"
            ref={this.QUESTION_REF()} /><br/>
          <div>
            <button
              type="submit"
              onClick={this.createChoice.bind(this)}
              disabled={this.tooManyChoices()}>Create new Choice</button><br/><br/>
            {this.renderAllChoices()}<br/>
          </div><br/>

          <label>{this.ANSWER_REF()}</label><br/>
          <input
            type="text"
            ref={this.ANSWER_REF()}/><br/>
        </fieldset>
      </div>
    );
  }
}
