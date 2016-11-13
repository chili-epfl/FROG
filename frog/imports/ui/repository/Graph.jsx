import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DraggableAc from './../DraggableAc.jsx';

//to be put in graph.jxs
const AxisDisplay = ( {reference} ) => { return(
  <div ref={reference}>
    <svg width="100%" height="200px" xmlns="http://www.w3.org/2000/svg" style={{overflow: "scroll"}}>
      <text x="0%" y="20%">Plane 1</text>
      <line x1="10%" y1="20%" x2="100%" y2="20%" style={{stroke: 'black', strokeWidth:"1"}} />

      <text x="0%" y="60%">Plane 2</text>
      <line x1="10%" y1="60%" x2="100%" y2="60%" style={{stroke: 'black', strokeWidth:"1"}}/>

      <text x="0%" y="100%">Plane 3</text>
      <line x1="10%" y1="100%" x2="100%" y2="100%" style={{stroke: 'black', strokeWidth:"1"}}/>
    </svg>
  </div>
)}

const divStyle = {
  height: 600,
  width: "100%",
  overflow: "scroll"
}

class Graphdisplayer extends Component {
  renderGraph() {
    return (
      <div>
        <DraggableAc
          interaction={true}
          plane={2}
          key={2}
          startTime={1}
          duration={45}/>
        <DraggableAc
          interaction={true}
          plane={1}
          key={1}
          startTime={60}
          duration={90}/>

        <DraggableAc
          interaction={true}
          plane={3}
          key={3}
          startTime={165}
          duration={45}/>
    </div>
    );
  }
  render() {
    return(
      <div style={divStyle}>
        {this.renderListGraphs()}
        <AxisDisplay />
      </div>
    );
  }
}

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isClicked: false,
    }
  }

  graphHandler = (event) => {
    event.preventDefault();
    this.setState({isClicked: !this.state.isClicked});

  }

  render() {
    return (
      <div className="graph-summary">
        <li onClick={this.graphHandler}>
        {this.props.name}
        </li>

      {
        //If the user has clicked on the graph, put prevous properties in addition
        //to hidden properties (returned by the renderObjectProperties)
        this.state.isClicked ? <GraphDisplayer />: ""
      }

      </div>
      );
  }
}
