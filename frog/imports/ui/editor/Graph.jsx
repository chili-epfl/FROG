import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GraphActivity from './GraphActivity.jsx';
import TestGoogleCharts from './TestGoogleCharts.jsx';

/*
Class used to display the form to create a new graph
*/
export default class Graph extends Component {


  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      idActivities:0, //need this to have unique keys
      listActivities:[],
    }
  }

  handleIDChange(event) {
    event.preventDefault();
    this.setState({id:event.target.value.trim()});
  }

  handleNameChange(event) {
    event.preventDefault();
    this.setState({name:event.target.value.trim()});
  }

    //To avoid problems with unbounded number of activities
  tooManyActivities() {
    return this.state.listActivities.length >= 20;
  }

  enoughActivities() {
    return this.state.listActivities.length > 0;
  }

  renderAllActivities() {
    return(
      <div>
        {this.state.listActivities.map((ref, i) =>
        <GraphActivity
          ref={ref}
          key={ref}
          id={i}
          refID={ref}
          followingRef={(i < this.state.listActivities.length - 1) ? this.state.listActivities[i+1] : null}
          callBack={this.deleteActivity.bind(this)}/>)}
      </div>
    );
  }

  createActivity(event) {
    event.preventDefault();

    if(!this.tooManyActivities()) {
      var allActivities = this.state.listActivities.concat(("Activity"+this.state.idActivities));
      this.setState({listActivities:allActivities, idActivities: this.state.idActivities + 1});
    }

  }

  deleteActivity(id) {
    var newListActivities = this.state.listActivities.filter((ref) =>{
    var activity = (this.refs[ref]);
      return activity.props.refID != id;
    });

    this.setState({listActivities: newListActivities});
  }

  getGraph() {
    return ({
      "_id": this.state.id,
      "name": this.state.name,
      "nodes": this.getNodes(),
      "edges": this.getEdges(),
    });
  }


  getNodes() {
    alert(this.state.listActivities)
    var nodes = this.state.listActivities.map((ref) => {
      var activity = (this.refs[ref]);
      return activity.getNode();
    });

    return nodes;
  }

  getEdges() {

    var edges = this.state.listActivities.map((ref) => {
      var activity = (this.refs[ref]);
      var edge = activity.getEdge();
      if(edge != null) {
        return ({
          from:edge.from,
          to:this.refs[edge.toRef].getNode(),
          operator:edge.operator,
        });
      }
      else {
        return null;
      }
    });

    return edges;
  }

  render() {
    return(
      <div>
        <form>
          <label>ID</label><br/>
          <textarea
            type="text"
            ref="id"
            onChange={this.handleIDChange.bind(this)}
            onSubmit={this.handleIDChange.bind(this)}/>
          <br/><br/>

          <label>Name</label><br/>
          <textarea
            type="text"
            ref="name"
            onChange={this.handleNameChange.bind(this)}
            onSubmit={this.handleNameChange.bind(this)}/>
          <br/><br/>
        </form>

        <button
              type="submit"
              onClick={this.createActivity.bind(this)}
              disabled={this.tooManyActivities()}>Add an activity</button><br/><br/>

        {this.renderAllActivities()}

        <TestGoogleCharts />

      </div>
    );
  }
}