import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';
import Draggable from 'react-draggable';
import Form from 'react-jsonschema-form'

import { Activities, Operators, addGraphActivity, addGraphOperator, copyActivityIntoGraphActivity, copyOperatorIntoGraphOperator, dragGraphActivity, deleteGraphActivities } from '../api/activities';
import { Graphs, addOrUpdateGraph } from '../api/graphs';
import { uuid } from 'frog-utils'

import jsPlump from 'jsplumb';
import { $ } from 'meteor/jquery';

const planeNames = ['solo','group','class'];



const ActivityChoiceComponent = ( { outActivities, ownId } ) => {
  var selectedActivity = outActivities[0]._id
  
  const changeActivityChoice = (event) => {selectedActivity = event.target.value}
  
  const submitActivityChoice = () => { copyActivityIntoGraphActivity(ownId, selectedActivity) }

  return (
    <form className='selector' onSubmit={submitActivityChoice} >
      <select onChange={changeActivityChoice}>
        {outActivities.map(activity => <option key={activity._id} value={activity._id}>{activity.data.name}</option>)}
      </select>
      <input type="submit" value="Submit" />
    </form>
  )
}

const ActivityInEditor = ( { activity, addOperator, outActivities }  ) => { 

  const eventLogger = (e, data) => {
    console.log('Event: ', event);
    console.log('Data: ', data);
    dragGraphActivity(activity._id, activity.xPosition)
  }

  console.log(activity)

  return (
    <Draggable
      axis='x'
      bounds='parent'
      handle='.title'
      onStop={eventLogger} >
      <div className={'item'} id={activity._id} style={{left: activity.xPosition}}>
        { activity.data ? 
          <div className={'title'}> {activity.data.name} </div>
          : <ActivityChoiceComponent outActivities={outActivities} ownId={activity._id} />
        }
        <button
          id={'connector' + activity._id}
          className='btn btn-primary btn-sm connector'
          style={{bottom: 0,width:'100%'}}>
          Connect
        </button>
      </div>
    </Draggable>
  )
}

const OperatorChoiceComponent = ({ outOperators, ownId }) => {
  var selectedOperator = outOperators[0]._id
  
  const changeOperatorChoice = (event) => {selectedOperator = event.target.value}
  
  const submitOperatorChoice = () => { copyOperatorIntoGraphOperator(ownId, selectedOperator) }

  return (
    <form className='selector' onSubmit={submitOperatorChoice} >
      <select onChange={changeOperatorChoice}>
        {outOperators.map(operator => <option key={operator._id} value={operator._id}>{operator.operator_type}</option>)}
      </select>
      <input type="submit" value="Submit" />
    </form>
  )
}

const EditorView = ( { graph, inActivities, inOperators, outActivities, outOperators, addOperator, setState, jsPlumbRemoveAll } ) => {
  
  const deleteAll = () => {
    jsPlumbRemoveAll()
    deleteGraphActivities(graph._id)
    setState({name: 'untitled',activities: [],operators: []})
  }
  const renameCurrentGraph = (name) => { setState({ name: name }) }
  const copyCurrentGraph = () => { setState({ _id: uuid() })}

  const saveCurrentGraph = () => { addOrUpdateGraph(graph) }

  return(
    <div>
      <h3>Graph editor</h3>
      <div>
        <p>Double click for creating</p>
        <div id='container'>
          {planeNames.map((plane) => { return(
            <div className='plane' id={plane} key={plane}>
              <p style={{float:'right'}}>{plane}</p>
              { inActivities.map(activity =>
                plane==activity.plane ?
                  <ActivityInEditor
                    key={activity._id}
                    outActivities={outActivities}
                    activity={activity} 
                    addOperator={addOperator}
                  />
                :null
              )}
            </div>
          )})}
        </div>
        <input
          onChange={(event) => renameCurrentGraph(event.target.value)}
          value={graph.name}
        />
        <button className='btn btn-primary btn-sm' onClick={saveCurrentGraph}>Save</button>
        <button className='btn btn-primary btn-sm' onClick={copyCurrentGraph}>Copy</button>
        <button className='btn btn-danger btn-sm' onClick={deleteAll}>Delete</button>
      </div>
      { inOperators.map(operator => 
        operator.data ? null 
        : <OperatorChoiceComponent
          key={operator._id}
          outOperators={outOperators} 
          ownId={operator._id} 
        /> 
      )}
    </div>
  )
}

const EditorViewContainer = createContainer((props) => {
  console.log('EditorViewContainer')
  console.log(props)
  return({
    ...props,
    inActivities: Activities.find({ graphId: props.graph._id }).fetch(),
    inOperators: Operators.find({ graphId: props.graph._id }).fetch()
  })
}, EditorView)

const GraphList = ( { graphs, editSavedGraph, currentGraphId } ) => { return(
  <div>
    <h3>Graph list</h3>
    <ul> { graphs.map((graph) => 
      <li style={{listStyle: 'none'}} key={graph._id}>
        <a href='#' onClick={ () => Graphs.remove({_id: graph._id}) }><i className="fa fa-times" /></a>
        <a href='#' onClick={ () => editSavedGraph(graph) } ><i className="fa fa-pencil" /></a>
        {graph.name} {graph._id==currentGraphId? '(current)':null}
      </li>
    )} </ul>
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
  
  editSavedGraph = (graph) => {
    this.jsPlumbRemoveAll() 
    this.setState(graph) 
  }
  
  addActivity = (activityId) => {
    this.state.activities.push(activityId)
    this.forceUpdate()
  }

  addOperator= (source, target) => {
    const id = addGraphOperator({ graphId: this.state._id })
    this.state.operators.push({_id: id, source:source, target:target })
    this.forceUpdate()
  }

  componentDidMount() {
    const that = this

    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.setContainer($('#container'));

    this.jsPlumbInstance.bind('connection', function(info,originalEvent) {
      // testing if the event comes from a human
      if (originalEvent) {
        that.addOperator(info.sourceId,info.targetId)
      }
    });

    planeNames.forEach(plane => {
      $('#'+plane).dblclick(e => {
        console.log(e)
        const newGraphActivityId = addGraphActivity({ 
          plane:plane, 
          xPosition:e.offsetX, 
          graphId:that.state._id 
        })
        that.addActivity(newGraphActivityId)
      })
    })
  }

  componentDidUpdate() {
    this.jsPlumbRemoveAllAndDrawAgain()
  }

  jsPlumbRemoveAll = () => {
    console.log('jsPlumbRemoveAll')
    this.jsPlumbInstance.detachEveryConnection();
    this.jsPlumbInstance.deleteEveryEndpoint();
    this.jsPlumbInstance.unmakeEveryTarget();
    this.jsPlumbInstance.unmakeEverySource();
  }

  jsPlumbDrawAll = () => {
    console.log('jsPlumbDrawAll')
    this.state.activities.forEach((activityId) => {
      this.jsPlumbInstance.makeSource($('#connector'+activityId),{anchor:'Continuous'})
      this.jsPlumbInstance.makeTarget($('#connector'+activityId),{anchor:'Continuous'})
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
      <EditorViewContainer 
        graph={this.state}
        outActivities={this.props.outActivities}
        outOperators={this.props.outOperators}
        addOperator={this.addOperator}
        jsPlumbRemoveAll={this.jsPlumbRemoveAll}
        setState={(x) => this.setState(x)}
      />
      <GraphList 
        graphs={this.props.graphs} 
        editSavedGraph={this.editSavedGraph}
        currentGraphId={this.state._id}
      />
      <pre>{JSON.stringify(this.state, null, 2)}</pre>
    </div>
  )}
}

export default createContainer(() => {
  return {
    outActivities: Activities.find({status:'OUT'}).fetch(),
    outOperators: Operators.find({status:'OUT'}).fetch(),
    graphs: Graphs.find({}).fetch()
  }
}, GraphEditor)
