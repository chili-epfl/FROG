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
      <text x="0%" y="10%">Plane 1</text>
      <line x1="10%" y1="10%" x2="100%" y2="10%" style={{stroke: 'black', strokeWidth:"2"}} />

      <text x="0%" y="50%">Plane 2</text>
      <line x1="10%" y1="50%" x2="100%" y2="50%" style={{stroke: 'black', strokeWidth:"2"}}/>

      <text x="0%" y="90%">Plane 3</text>
      <line x1="10%" y1="90%" x2="100%" y2="90%" style={{stroke: 'black', strokeWidth:"2"}}/>
    </svg>
  </div>
)}


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
            interaction='false'
            plane={graph.}
        )) : <li>No graph</li>
    );
    */

    //to bo put in graph.jsx
    return(
      <div>
        <DraggableAc
          interaction={true}
          plane={1}
          key={1}
          startTime={1}
          duration={4}/>

        <DraggableAc
          interaction={true}
          plane={2}
          key={2}
          startTime={2}
          duration={3}/>
        <DraggableAc
          interaction={true}
          plane={3}
          key={3}
          startTime={3}
          duration={5}/>
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
        <ul>
        {this.renderListGraphs()}
        </ul>
        <GraphDisplay />

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
