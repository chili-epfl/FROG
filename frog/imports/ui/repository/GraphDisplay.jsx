import React, { Component } from 'react';
import Graph from '../graph/Graph';

export default class GraphDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isClicked: false
    }
  }

  graphHandler = (event) => {
    event.preventDefault();
    this.setState({ isClicked: !this.state.isClicked });
  }

  render() {
    return (
      <div className='graph-summary'>
        <div>
          <a href='#' onClick={this.graphHandler}>{this.props.graph.name}</div>
          {this.state.isClicked ?
            <div>
              <Graph />
            </div>
          : ''}
        </a>

      </div>
    );
  }
}
