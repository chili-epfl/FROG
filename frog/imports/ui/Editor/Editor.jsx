import React, { Component } from 'react';
import Activity from './Activity.jsx';
 
export default class Editor extends Component {

	handleSubmit() {
		alert(JSON.stringify(this.refs.newActivity.generateActivity()));
	}

	render() {
		return(
			<div>
	      <Activity ref="newActivity" />
	      <button
	          type="submit"
	          onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
  	)
	}

}
