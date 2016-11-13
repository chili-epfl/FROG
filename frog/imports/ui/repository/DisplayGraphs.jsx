import React, { Component, PropTypes } from 'react';
import { Graphs } from '../../api/graphs.js';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
//import Graph from './Graph.jsx';
import DraggableAc from './../DraggableAc.jsx';

//to be put in graph.jxs
const GraphDisplay = ( {reference} ) => { return(
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


class DisplayGraphs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nameFilterText: "",
    }
  }

  handleFilterNameChange(event) {
    event.preventDefault();
    this.setState({nameFilterText: event.target.value.trim()});
  }

  renderListGraphs() {
    /*
    return (
      this.props.graphs ?
        this.props.graphs
          .filter((graph) => graph.name.toLowerCase()
            .indexOf(this.state.nameFilterText.toLowerCase()) != -1)
          .map((graph, i) => (
          <DraggableAc
            editorMode='false'
            plane={graph.}
        )) : <li>No graph</li>
    );
    */

    //to bo put in graph.jsx
    return(
      <div>
        <DraggableAc
          editorMode={true}
          plane={2}
          key={2}
          startTime={0}
          duration={45}/>
        <DraggableAc
          editorMode={true}
          plane={1}
          key={1}
          startTime={60}
          duration={90}/>

        <DraggableAc
          editorMode={true}
          plane={3}
          key={3}
          startTime={165}
          duration={45}/>
    </div>
    );
  }

  render() {
    return(
      <div>
        <h2>Graphs</h2>
        <form className="filter-graphs">
          <input
            type="text"
            ref="filterName"
            placeholder="Filter by name"
            onChange={this.handleFilterNameChange.bind(this)}/><br/>
        </form>
        <div style={divStyle}>
          {this.renderListGraphs()}
          <GraphDisplay />
        </div>

      </div>
    );
  }
}

DisplayGraphs.propTypes = {
  graphs: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    graphs: Graphs.find({}).fetch(),
  };
}, DisplayGraphs);
