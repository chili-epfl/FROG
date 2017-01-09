import React, { Component, PropTypes } from 'react';
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
          <div onClick={this.graphHandler}>{this.props.graph.name}</div>
          {this.state.isClicked ?
            <div>
              <Graph />
            </div>
          : ''}
        </div>

      </div>
    );
  }
}
