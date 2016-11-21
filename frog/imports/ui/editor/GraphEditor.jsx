import React, { Component } from 'react';
import Graph from './Graph.jsx';
import { Graphs } from '../../api/graphs.js';

export default class GraphEditor extends Component {


  handleSubmit(event) {
    event.preventDefault();
    alert(JSON.stringify(this.refs.newGraph.getGraph()));
  }

  render() {
    return(
      <div>
        <h2>Insert a new Graph:</h2>
        <Graph ref="newGraph" />
        <button
          type="submit"
          onClick={this.handleSubmit.bind(this)}
          >Submit</button>
      </div>
    )
  }

}
