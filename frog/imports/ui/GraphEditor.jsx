import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';
import Draggable from 'react-draggable';

import { Activities, Operators } from '../api/activities';
import { Graphs, addOrUpdateGraph } from '../api/graphs';
import { uuid } from 'frog-utils'

import jsPlump from 'jsplumb';
import { $ } from 'meteor/jquery';

const planeNames = ['solo','group','class'];

class ActivityInEditor extends Component { 

  constructor(props) {
    super(props);
    this.activityID = this.props.index
  }

  eventLogger = (e, data) => {
    console.log('Event: ', event);
    console.log('Data: ', data);
    this.props.dragActivity(data.x, this.activityID)
  }

  componentWillReceiveProps() {
    console.log('update >> repainting all')
    this.props.jsPlumbInstance.repaintEverything()
  }

  render() { 
    return (
      <Draggable
        axis='x'
        bounds='parent'
        handle='.title'
        onStop={this.eventLogger} >
        <div className={'item'} style={{left: this.props.xPosition}}>
          <div className={'title'}> {this.props.activity.name + this.props.index} </div>
          <button
            id={'connector' + this.props.index}
            className='btn btn-primary btn-sm connector' 
            onClick={() => this.props.addOperator(this.props.index-1,this.props.index)}>
            Connect
          </button>
        </div>
      </Draggable>
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

  newGraph = () => {
    this.setState({
      name: 'untitled',
      activities: [],
      operators: []
    })
    this.jsPlumbRemoveAllAndDrawAgain()
  }

  saveCurrentGraph = () => { 
    addOrUpdateGraph(this.state)
    this.jsPlumbRemoveAllAndDrawAgain()
  }

  renameCurrentGraph = (name) => { 
    this.setState({ name: name }) 
  }

  addActivity = (name, plane) => {
    console.log('addActivity')
    const activities = this.state.activities
    activities.push({ 
      name:name, 
      plane: plane, 
      _id:uuid(),
      xPosition: 100 * activities.length
    })
    this.setState({ activities: activities })
    this.jsPlumbRemoveAllAndDrawAgain()
  }

  addOperator= (source, target) => {
    console.log('addOperator')
    const operators = this.state.operators
    operators.push({
      source:source,
      target:target
    })
    this.setState({
      operators: operators
    })

    this.jsPlumbRemoveAllAndDrawAgain()
  }

  dragActivity = (deltaX,index) => {
    this.state.activities[index].xPosition += deltaX
    this.forceUpdate()
    this.jsPlumbRemoveAllAndDrawAgain()
  }

  componentDidMount() {
    console.log('mount')
    const that = this

    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.setContainer($('#container'));

    planeNames.forEach(plane => {
      $('#'+plane).dblclick(e => {
        console.log('dbclick')
        that.addActivity('Activity',plane)
      })
    })

    this.jsPlumbRemoveAllAndDrawAgain()
  }

  jsPlumbRemoveAllAndDrawAgain = () => {
    console.log('jsPlumbRemoveAllAndDrawAgain')
    this.jsPlumbInstance.detachEveryConnection();
    this.jsPlumbInstance.deleteEveryEndpoint();
    this.state.operators.forEach(operator => {
      this.jsPlumbInstance.connect({
        source:$('#connector'+operator.source),
        target:$('#connector'+operator.target),
        anchors:['Continuous','Continuous']
      })
    })
  }

  render() { return(
    <div>
      <div>
        <h3>Graph editor</h3>
        <div>
          <p>Double click for creating</p>
          <div id='container'>
            {planeNames.map((plane) => { return(
              <div className='plane' id={plane} key={plane}>
                <p style={{float:'right'}}>{plane}</p>
                { this.state.activities.map((activity,index) =>
                  activity.plane==plane ?
                    <ActivityInEditor 
                      activity={activity} 
                      index={index}
                      key={uuid()} 
                      jsPlumbInstance={this.jsPlumbInstance}
                      dragActivity={this.dragActivity}
                      addOperator={this.addOperator}
                      xPosition={activity.xPosition}
                    />
                  :null
                ) }
              </div>
            )})}
          </div>
          <input
            onChange={(event) => this.renameCurrentGraph(event.target.value)}
            value={this.state.name}
          />
          <button className='btn btn-primary btn-sm' onClick={this.saveCurrentGraph}>Save</button>
          <button className='btn btn-danger btn-sm' onClick={this.newGraph}>Delete</button>
          <button className='btn btn-danger btn-sm' onClick={this.jsPlumbRemoveAllAndDrawAgain}>Redraw</button>
        </div>
      </div>
      <GraphList 
        graphs={this.props.graphs} 
        createNewGraph={this.createNewGraph}
        setFn={(graph) => this.setState(graph)}
      />
      <pre>{JSON.stringify(this.state, null, 2)}</pre>
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
