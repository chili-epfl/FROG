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

const ActivityInEditor = ( { activity, index, dragActivity, addOperator }  ) => { 

  const eventLogger = (e, data) => {
    console.log('Event: ', event);
    console.log('Data: ', data);
    dragActivity(data.x, index)
  }

  return (
    <Draggable
      axis='x'
      bounds='parent'
      handle='.title'
      onStop={eventLogger} >
      <div className={'item'} style={{left: activity.xPosition}}>
        <div className={'title'}> {activity.name + index} </div>
        <button
          id={'connector' + index}
          className='btn btn-primary btn-sm connector'
          style={{bottom: 0,width:'100%'}}>
          Connect
        </button>
      </div>
    </Draggable>
  )
}

const GraphList = ( { graphs, editSavedGraph } ) => { 
  return(
    <div>
      <h3>Graph list</h3>
      <ul> { graphs.map((graph) => 
        <li style={{listStyle: 'none'}} key={graph._id}>
          <a href='#' onClick={ () => Graphs.remove({_id: graph._id}) }>
            <i className="fa fa-times" />
          </a>
          <a href='#' onClick={ () => editSavedGraph(graph) } >
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
    this.jsPlumbRemoveAll()
    this.setState({name: 'untitled',activities: [],operators: []}) 
  }
  editSavedGraph = (graph) => {
    this.jsPlumbRemoveAll() 
    this.setState(graph) 
  }
  saveCurrentGraph = () => { addOrUpdateGraph(this.state) }
  renameCurrentGraph = (name) => { this.setState({ name: name }) }
  copyCurrentGraph = () => { this.setState({ _id: uuid() })}

  addActivity = (info) => {
    this.state.activities.push({...info, _id:uuid()})
    this.forceUpdate()
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
  }

  dragActivity = (deltaX,index) => {
    this.state.activities[index].xPosition += deltaX
    this.forceUpdate()
  }

  componentDidMount() {
    console.log('mount')
    const that = this

    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.setContainer($('#container'));

    this.jsPlumbInstance.bind('connection', function(info,originalEvent) {
      console.log('connection made!')
      console.log(info)
      console.log(originalEvent)
      // testing if the event comes from a human
      if (originalEvent) {
        that.addOperator(info.sourceId,info.targetId)
      }
    });

    planeNames.forEach(plane => {
      $('#'+plane).dblclick(e => {
        console.log(e)
        that.addActivity({ name: 'Activity', plane:plane, xPosition:e.offsetX})
      })
    })
  }

  componentDidUpdate() {
    console.log('update')
    this.jsPlumbRemoveAllAndDrawAgain()
  }

  jsPlumbRemoveAll = () => {
    this.jsPlumbInstance.detachEveryConnection();
    this.jsPlumbInstance.deleteEveryEndpoint();
    this.jsPlumbInstance.unmakeEveryTarget();
    this.jsPlumbInstance.unmakeEverySource();
  }

  jsPlumbDrawAll = () => {
    this.state.activities.forEach((activity,index) => {
      this.jsPlumbInstance.makeSource($('#connector'+index),{anchor:'Continuous'})
      this.jsPlumbInstance.makeTarget($('#connector'+index),{anchor:'Continuous'})
    })
    this.state.operators.forEach(operator => {
      this.jsPlumbInstance.connect({
        source:$('#'+operator.source),
        target:$('#'+operator.target),
        anchors:['Continuous','Continuous']
      })
    })
  }

  jsPlumbRemoveAllAndDrawAgain = () => {
    console.log('jsPlumbRemoveAllAndDrawAgain')
    this.jsPlumbRemoveAll()
    this.jsPlumbDrawAll()
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
                      key={uuid()} 
                      activity={activity} 
                      index={index}
                      dragActivity={this.dragActivity}
                      addOperator={this.addOperator}
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
          <button className='btn btn-primary btn-sm' onClick={this.copyCurrentGraph}>Copy</button>
          <button className='btn btn-danger btn-sm' onClick={this.newGraph}>Delete</button>
        </div>
      </div>
      <GraphList 
        graphs={this.props.graphs} 
        editSavedGraph={this.editSavedGraph}
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
