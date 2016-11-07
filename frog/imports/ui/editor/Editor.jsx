import React, { Component } from 'react';
import ActivityEditor from './ActivityEditor.jsx';
import GraphEditor from './GraphEditor.jsx';
import { Activities } from '../../api/activities.js';
import QuizSchema from './QuizSchema.jsx';

export default class Editor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editorType:"activity", 
    }
  }

  handleEditorChange(event) {
    event.preventDefault();
    this.setState({editorType: event.target.value,});
  }

  render() {

    return(
      <div>
        <h2>Editor</h2>
        <form>
        <input 
          type="radio" 
          value="activity"
          readOnly
          checked={this.state.editorType === "activity"}
          onChange={this.handleEditorChange.bind(this)}
          />Activity<br/>
        <input 
          type="radio" 
          value="graph"
          readOnly
          checked={this.state.editorType === "graph"} 
          onChange={this.handleEditorChange.bind(this)}
          />Graph<br/>
         </form> 

        { (this.state.editorType === "activity") ? <ActivityEditor ref="activityEditor" /> : <GraphEditor ref="graphEditor" />}
      </div>
    )
  }

}