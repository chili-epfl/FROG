import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Quiz from './Quiz.jsx';
 

/*
Class used for the form to be dynamic and change when the user chooses between the different types
*/
export default class ActivityType extends Component {

	constructor(props) {
		super(props);

    this.state = {
      lectureURL:"",
      videoURL:"",
      nbQuestions:0,
      listQuiz:[],
    }
	}

  haveFieldsCompleted() {
    switch (this.props.type) {
      case this.props.LECTURE_TYPE:
        return this.state.lectureURL !== "";
      case this.props.VIDEO_TYPE:
        return this.state.videoURL !== "";
      case this.props.QUIZ_TYPE:
        var quizzesFieldsCompleted = (this.state.listQuiz.length !== 0);

        this.state.listQuiz.forEach((ref) => {
          var quiz = (this.refs[ref]);
          quizzesFieldsCompleted = quizzesFieldsCompleted && quiz.haveFieldsCompleted();
        });

        return quizzesFieldsCompleted;
      default:
        return false; //If we don't know what type it is, we can't submit
    }
  }

  //Used to delete a quiz, when delete button is hit. Deletes only last quiz created.
  deleteQuiz(event) {
    event.preventDefault();

    var allQuiz = this.state.listQuiz;
    allQuiz.pop();
    this.setState({listQuiz:allQuiz});

    this.setState({
      nbQuestions: this.state.nbQuestions - 1,
    });
  }

  //Used to create a quiz, when create button is hit. Creates only in the end of the list of quiz.
  createQuiz(event) {
    event.preventDefault();

    var allQuiz = this.state.listQuiz;
    allQuiz.push(this.props.QUIZ_TYPE + this.state.nbQuestions);
    this.setState({listQuiz:allQuiz});

    this.setState({
      nbQuestions: this.state.nbQuestions + 1,
    });

  }

  //Once requested, this component generates the sub-form answer
  generateAnswers() {
    switch (this.props.type) {
      case this.props.LECTURE_TYPE:
        return ({path: this.state.lectureURL});

      case this.props.VIDEO_TYPE:
        return ({url: + this.state.videoURL});

      case this.props.QUIZ_TYPE:
        return (this.generateQuizAnswers());

      default:
        return("");
    }
  }

  //Once requested, this component generates the form answer of all quizzes
  generateQuizAnswers() {

    var questions = this.state.listQuiz.map((ref) => {
      var quiz = (this.refs[ref]);
      return quiz.generateQuiz();
    });

    return questions;
  }

  renderAllQuiz() {
    return(
      <div>
      {this.state.listQuiz.map((ref, i) => <Quiz ref={ref} key={ref} id={i} />)}
      </div>
    );
  }

  handleLectureURLChange(event) {
    event.preventDefault();
    this.setState({lectureURL:event.target.value.trim()});
  }

  handleVideoURLChange(event) {
    event.preventDefault();
    this.setState({videoURL:event.target.value.trim()});
  }

  //Renders according to the type given in the props
  renderType() {
    switch (this.props.type) {
      case this.props.LECTURE_TYPE:
        return (
          <div>
            <input
              type="text"
              ref ="lectureURL"
              placeholder="Enter the path"
              onChange={this.handleLectureURLChange.bind(this)}
              onSubmit={this.handleLectureURLChange.bind(this)} /><br/>
          </div>
        );

      case this.props.VIDEO_TYPE:
        return (
          <div>
            <input
              type="text"
              ref ="videoPath"
              placeholder="Enter the Youtube URL"
              onChange={this.handleVideoURLChange.bind(this)}
              onSubmit={this.handleVideoURLChange.bind(this)} /><br/>          
          </div>
        );

      case this.props.QUIZ_TYPE:
        return (
          <div>
            <button
            type="submit"
            onClick={this.createQuiz.bind(this)}>Create new Question</button>
            {this.renderAllQuiz()}
            <button
            type="submit"
            onClick={this.deleteQuiz.bind(this)}
            disabled={this.state.nbQuestions == 0}
            >Delete last Question</button>
          </div>
        );

      default:
        return("");
    }

  }

  render() {
    return(
      <div>
        {this.renderType()}
      </div>
    )
  }

	
}
