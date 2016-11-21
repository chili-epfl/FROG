import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';

import { Activities, Operators } from '../api/activities';
import { Graphs, addOrUpdateGraph } from '../api/graphs';
import { uuid } from 'frog-utils'

import jsPlump from 'jsplumb';
import { $ } from 'meteor/jquery';

const planeNames = ['solo','group','class'];

const Editor = ( { graph, saveCurrentGraph, renameCurrentGraph, jsPlumbInstance } ) => { return(
    <div>
      <h3>Graph editor</h3>
      <div>
        <p>Double click for creating</p>
        <div id='container'>
          {planeNames.map((plane) => { return(
            <div className='plane' id={plane} key={plane}>
              <p style={{float:'right'}}>{plane}</p>
              { graph ? graph.activities.filter(activity => activity.plane==plane).map(activity =>
                <ActivityInEditor activity={activity} key={uuid()} jsPlumbInstance={jsPlumbInstance} />
              ) : null }
            </div>
          )})}
        </div>
        <input
          onChange={(event) => renameCurrentGraph(event.target.value)}
          value={graph.name}
        />
        <button className='btn btn-primary btn-sm' onClick={() => saveCurrentGraph()}>Save</button>
      </div>
    </div>
)}

class ActivityInEditor extends Component { 

  constructor(props) {
    super(props);
    this.activityID = this.props.activity._id;
    this.productID = 'product' + this.activityID;
    this.objectID = 'object' + this.activityID;
  }

  componentDidMount() {
    const that = this
    this.props.jsPlumbInstance.makeTarget($('#'+that.objectID), { anchor: 'Continuous' });
    this.props.jsPlumbInstance.makeSource($('#'+that.productID), { anchor: 'Continuous' });     
    this.props.jsPlumbInstance.draggable($('#'+that.activityID), { axis:'x', containment: 'parent' });
  }

  render() { 
    return (
      <div id={this.activityID} className={'item'}>
        <div className={'title'}> {this.props.activity.name} </div>
        <div id={this.productID} className={'product'}> product </div>
        <div id={this.objectID} className={'object'}> object </div>
      </div>
    )
  }
}

const GraphList = ( { graphs, createNewGraph, setFn } ) => { 
  return(
    <div>
      <h3>Graph list</h3>
      <ul> { graphs.map((graph) => 
        <li style={{listStyle: 'none'}} key={graph._id}>
          <a href='#' onClick={ () => Graphs.remove({_id: graph._id}) }>
            <i className="fa fa-times" />
          </a>
          <a href='#' onClick={ () => setFn(graph) } >
            <i className="fa fa-pencil" />
          </a>
          {graph.name}
        </li>
      )} 
    </ul>
  </div>
  )
}

class GraphEditor extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      _id: uuid(),
      name: 'untitled',
      activities: [],
      operators: [] 
    }
  }

  saveCurrentGraph = () => {
    addOrUpdateGraph(this.state)
  }

  renameCurrentGraph = (name) => {
    this.setState({ name: name })
  }

  addActivity = (name, plane) => {
    const activities = this.state.activities
    activities.push({ name:name, plane: plane, _id:uuid() })
    this.setState({ activities: activities })
  }

  componentDidMount() {
    const that = this
    
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.setContainer($('#container'));
    
    var i = 0;
    planeNames.forEach(plane => {
      $('#'+plane).dblclick(e => {
        that.addActivity('Activity'+i,plane)
        i++;
      });
    });
  }

  render() { return(
    <div>
      <pre>{JSON.stringify(this.state, null, 2)}</pre>
      <Editor 
        graph={this.state} 
        saveCurrentGraph={this.saveCurrentGraph}
        renameCurrentGraph={this.renameCurrentGraph}
        jsPlumbInstance={this.jsPlumbInstance}
      />
      <GraphList 
        graphs={this.props.graphs} 
        createNewGraph={this.createNewGraph}
        setFn={(graph) => this.setState(graph)}
      />
    </div>
  )}
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    operators: Operators.find({}).fetch(),
    graphs: Graphs.find({}).fetch()
  }
}, GraphEditor)
