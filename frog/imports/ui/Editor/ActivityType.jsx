import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import QA from './QA.jsx';
 
export default class EditorTest extends Component {

	constructor(props) {
		super(props);

    this.state = {
      lectureURL:"",
      videoURL:"",
      nbQuestions:0,
      listQA:[],
    }
	}

  deleteQA(event) {
    event.preventDefault();

    var allQA = this.state.listQA;
    allQA.pop();
    this.setState({listQA:allQA});

    this.setState({
      nbQuestions: this.state.nbQuestions - 1,
    });
  }

  createQA(event) {
    event.preventDefault();

    var allQA = this.state.listQA;
    allQA.push("QA" + this.state.nbQuestions);
    this.setState({listQA:allQA});

    this.setState({
      nbQuestions: this.state.nbQuestions + 1,
    });

  }

  generateAnswers() {
    switch (this.props.type) {
      case this.props.LECTURE_TYPE:
        return ({path: this.state.lectureURL});

      case this.props.VIDEO_TYPE:
        return ({url: + this.state.videoURL});

      case this.props.QUIZ_TYPE:
        return (this.generateQAAnswers());

      default:
        return("");
    }
  }


  generateQAAnswers() {
    
    var questions= [];
    for (let i=0; i < this.state.nbQuestions; ++i) {
      var ref = this.state.listQA[i];
      var text = (this.refs[ref]);
      questions.push( text.generateQA() );

    }

    return questions.toString();
  }

  renderAllQA() {
    return(
      <div>
      {this.state.listQA.map((ref) => <QA ref={ref} key={ref} />)}
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
              placeholder="Enter the URL"
              onChange={this.handleVideoURLChange.bind(this)}
              onSubmit={this.handleVideoURLChange.bind(this)} /><br/>          
          </div>
        );

      case this.props.QUIZ_TYPE:
        return (
          <div>
            <button
            type="submit"
            onClick={this.createQA.bind(this)}>Create new Question</button>
            {this.renderAllQA()}
            <button
            type="submit"
            onClick={this.deleteQA.bind(this)}
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
