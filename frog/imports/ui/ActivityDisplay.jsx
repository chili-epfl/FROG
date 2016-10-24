import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
import QuestionDisplay from './QuestionDisplay.jsx';

export default class ActivityDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isClicked: false,
    }
  }

  activityHandler(event) {
    event.preventDefault();
    this.setState({
      isClicked: !this.state.isClicked,
    });
  }

  renderQuestions(){
    return (this.props.object.questions ?
      this.props.object.questions
        .map((questionz) => 
          (<QuestionDisplay 
            key = {String(this.props._id).concat(questionz.question)}
            id = {String(this.props._id).concat(questionz.question)}
            question = {questionz.question}
            choices = {questionz.choices}
            answer = {questionz.answer} />
          )) : <li>No Questions</li>);
  }

  renderActivityOnClick(){
    if (this.props.type == "lecture"){
      return (<div className="display-lecture">
                  Follow the URL: {this.props.object.path}
              </div>);
    } else if (this.props.type == "video"){
      return (<ReactPlayer url={this.props.object.url} playing />);
    } else if (this.props.type == "quiz"){
      return (<div className="display-quiz">
                      {this.renderQuestions()}
              </div>);
    } else {
      return "";
    };
  }

  render() {
    return (
      <div className="activity-summary">
      <li onClick={this.activityHandler.bind(this)}>
        {this.props.name}, type:{this.props.type}, plane:{this.props.plane}
      </li>

      {
        //If the user has clicked on the activity, put prevous properties in addition
        //to hidden properties (returned by the renderObjectProperties)
        this.state.isClicked ? this.renderActivityOnClick() : ""
      }

      </div>
    );
  }

}
