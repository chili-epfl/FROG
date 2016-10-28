import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';

export default class QuestionDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {
      correct: -1,
      answered: false,
    }
  }

  checkQuestion(event){
    event.preventDefault();
    this.setState({
      correct: this.state.answered ? this.state.correct : document.getElementById(this.props.question.concat(this.props.answer)).checked ? 1 : 0,
      answered: true,
    });
  }

  renderQuestionChoices(){
    return (this.props.choices ?
      this.props.choices.map((choice) =>
        <span key={this.props.question.concat(choice)}>
          <input
            id = {this.props.question.concat(choice)}
            type="radio"
            name={this.props.question}
            ref="quizChoices"
            value={choice}
          />{choice}<br/>
        </span>) : <li>No Choices</li>);
  }

  renderCorrect(){
    return (this.state.correct == 1 ? "Correct! The answer was ".concat(this.props.answer) : this.state.correct == 0 ? "Incorrect. The answer was ".concat(this.props.answer) : "Select an answer.");
  }

  render() {
    return (
      <div key={this.props.key}>
        {this.props.question}<br/>
        {this.renderQuestionChoices()}
        <button onClick={this.checkQuestion.bind(this)}>Submit Answer</button>
        <br/>
        {this.renderCorrect()}
      </div>
    );
  }

}
