import React, { Component, PropTypes } from 'react';
import { Graphs } from '../../api/graphs.js';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import Graph from './Graph.jsx';

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
    return (
      this.props.graphs ?
        this.props.graphs
          .filter((graph) => graph.name.toLowerCase()
            .indexOf(this.state.nameFilterText.toLowerCase()) != -1)
          .map((graph) => (
          <Graph
            key={graph._id}
            id={graph._id}
            name={graph.name}
            nodes={graph.nodes}
            edges={graph.edges} />
        )) : <li>No graph</li>
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
