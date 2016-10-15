import React, { Component } from 'react';
import ActivityType from './ActivityType.jsx';
 
export default class EditorTest extends Component {

	constructor(props) {
		super(props);

		LECTURE_TYPE = "Lecture";
    QUIZ_TYPE = "Quiz";
    VIDEO_TYPE = "Video";

    this.state = {

        id: "",
        name: "",
        type: LECTURE_TYPE,
        plane: 1,
        object: [],
    }
	}

	handleIDChange(event) {
		event.preventDefault();
		this.setState({id:event.target.value});
	}

	handleNameChange(event) {
		event.preventDefault();
		this.setState({name:event.target.value});
	}

	handleTypeChange(event) {
    event.preventDefault();
    this.setState({type:event.target.value});
  }

	handlePlaneChange(event) {
    event.preventDefault();
    this.setState({plane:event.target.value});
  }

	generateActivity() {
		var text =   {_id: this.state.id,
								 type: this.state.type,
								 name: this.state.name,
								 plane: this.state.plane,
                 object: this.refs.activityType.generateAnswers(), };
		return text;
	}

	render() {
	  return(
	  	<div>


	  		<form>
          <label>ID</label><br/>
          <textarea
            type="text"
            ref="id"
            onChange={this.handleIDChange.bind(this)}
            onSubmit={this.handleIDChange.bind(this)}/>
          <br/><br/>

          <label>Name</label><br/>
          <textarea
            type="text"
            ref="name"
            onChange={this.handleNameChange.bind(this)}
            onSubmit={this.handleNameChange.bind(this)}/>
            <br/><br/>

          <label>Plane</label><br/>
          <select ref="plane" defaultValue={1} onChange={this.handlePlaneChange.bind(this)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select><br/><br/>

          <label>Type</label><br/>
          <select ref="type" defaultValue={LECTURE_TYPE} onChange={this.handleTypeChange.bind(this)}>
            <option value={LECTURE_TYPE}>{LECTURE_TYPE}</option>
            <option value={QUIZ_TYPE}>{QUIZ_TYPE}</option>
            <option value={VIDEO_TYPE}>{VIDEO_TYPE}</option>
          </select><br/><br/>

        </form>

        <ActivityType ref="activityType" type={this.state.type} LECTURE_TYPE={LECTURE_TYPE} QUIZ_TYPE={QUIZ_TYPE} VIDEO_TYPE={VIDEO_TYPE}/>

      </div>
	  )
	}
}
