import React, { Component } from 'react';


/*
Class used to display a QCM Choices
*/
export default class QuizChoice extends Component {

  CHOICE_REF() {return "Choice "+(this.props.id+1); }

  constructor(props) {
    super(props);

    this.state = {
      choice:"",
      selected: false,
    }
  }

  //To say if all sub-form fields have been filled
  haveFieldsCompleted() {
    return this.state.choice !== "";
  }

  isSelected() {
    return this.state.selected;
  }

  //Once requested, this component generates the sub-form answer
  getChoice() {
    return this.state.choice;
  }

  selectChoice() {
    this.props.callBack(!this.state.selected);
    this.setState({selected: !this.state.selected});
  }

  handleChoiceChange(event) {
    event.preventDefault();
    this.setState({choice:event.target.value.trim()});
  }

  render() {
    return (
      <div >
        <label>{this.CHOICE_REF()}</label><br/>
        <input
          type="text"
          ref={this.CHOICE_REF()}
          onChange={this.handleChoiceChange.bind(this)}
          onSubmit={this.handleChoiceChange.bind(this)}/>
        <input
          type="checkbox"
          readOnly
          onClick={this.selectChoice.bind(this)}
          checked={this.state.selected} /><br/>
      </div>
      );
  }
}
