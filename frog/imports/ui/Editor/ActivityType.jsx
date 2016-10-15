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
    allQuiz.push("Quiz" + this.state.nbQuestions);
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
    
    var questions= [];
    for (let i=0; i < this.state.nbQuestions; ++i) {
      var ref = this.state.listQuiz[i];
      var text = (this.refs[ref]);
      questions.push( text.generateQuiz() );

    }

    return questions.toString();
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
    this.setState({lectureURL:event.target.value});
  }

  handleVideoURLChange(event) {
    event.preventDefault();
    this.setState({videoURL:event.target.value});
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
