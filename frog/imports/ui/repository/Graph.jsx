import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isClicked: false,
    }
  }

  graphHandler(event) {
    event.preventDefault();
    this.setState({
      isClicked: !this.state.isClicked,
    });
  }

  visualizeGraph() {
    return(
      <div className="graph-show">
        <p>I'm a graph !</p>
      </div>
    );
  }

  render() {
    return (
      <div className="graph-summary">
        <li onClick={this.graphHandler.bind(this)}>
        {this.props.name}
        </li>

      {
        //If the user has clicked on the graph, put prevous properties in addition
        //to hidden properties (returned by the renderObjectProperties)
        this.state.isClicked ? this.visualizeGraph() : ""
      }

      </div>
      );
  }
}
