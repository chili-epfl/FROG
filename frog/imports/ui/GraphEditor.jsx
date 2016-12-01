import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';
import Draggable from 'react-draggable';

import { Activities, Operators, addGraphActivity, addGraphOperator, copyActivityIntoGraphActivity, copyOperatorIntoGraphOperator, dragGraphActivity, removeGraph } from '../api/activities';
import { Graphs, addGraph, renameGraph } from '../api/graphs';

import jsPlump from 'jsplumb';
import { $ } from 'meteor/jquery';

const planeNames = ['class','group','individual'];

const setCurrentGraph = (graphId) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.editingGraph': graphId}})
}

var jsPlumbInstance = null

jsPlumbRemoveAll = () => {
  if(jsPlumbInstance){
    jsPlumbInstance.detachEveryConnection();
    jsPlumbInstance.deleteEveryEndpoint();
    jsPlumbInstance.unmakeEveryTarget();
    jsPlumbInstance.unmakeEverySource();
  }
}

jsPlumbDrawAll = (activities,operators) => {
  if(jsPlumbInstance){
    activities.forEach(activity => {
      jsPlumbInstance.makeSource($('#'+activity._id),{anchor:'Continuous'})
      jsPlumbInstance.makeTarget($('#'+activity._id),{anchor:'Continuous'})
    })
    operators.forEach(operator => {
      jsPlumbInstance.connect({
        source:$('#'+operator.from),
        target:$('#'+operator.to),
        anchors:['Continuous','Continuous']
      })
    })
  }
}

jsPlumbRemoveAllAndDrawAgain = (activities,operators) => {
  jsPlumbRemoveAll()
  jsPlumbDrawAll(activities,operators)
}

const ActivityChoiceComponent = createContainer(
  (props) => { return ({
    ...props,
    activities: Activities.find({status:'OUT'}).fetch()
  })},
  ( { activities, ownId } ) => {
    var selectedActivity = activities[0] ? activities[0]._id :null
    
    const changeActivityChoice = (event) => { selectedActivity = event.target.value }

    const submitActivityChoice = (event) => { 
      event.preventDefault()
      copyActivityIntoGraphActivity(ownId, selectedActivity) 
    }

    return (
      <form className='selector' onSubmit={submitActivityChoice} >
        <select onChange={changeActivityChoice}>
          {activities.map(activity => <option key={activity._id} value={activity._id}>{activity.data.name}</option>)}
        </select>
        <input type="submit" value="Submit" />
      </form>
    )
  }
)

class ActivityInEditor extends Component { 

  eventLogger = (event, data) => {
    dragGraphActivity(this.props.activity._id, data.x)
    this.forceUpdate()
  }

  render() { return (
    <div >
      <Draggable
        axis='x'
        handle='.title'
        position={{x:0,y:0}}
        onStop={this.eventLogger} >
        <div className={'item'} style={{ left: this.props.activity.xPosition+'px' }}>
          { this.props.activity.data ? 
            <div className={'title'}> {this.props.activity.data.name} </div>
            : <ActivityChoiceComponent ownId={this.props.activity._id} />
          }
          <button 
            className='btn btn-primary btn-sm connector' 
            style={{ bottom: 0, width:'100%', position:'absolute' }}
            id={this.props.activity._id} > 
            Connect 
          </button>
        </div>
      </Draggable>
    </div>
  )}
}

const OperatorChoiceComponent = createContainer(
  (props) => { return({ 
    ...props,
    operators: Operators.find({status:'OUT'}).fetch() 
  })}, 
  ({ operators, ownId }) => {
    var selectedOperator = operators[0] ? operators[0]._id: null
    
    const changeOperatorChoice = (event) => {selectedOperator = event.target.value}
    
    const submitOperatorChoice = (event) => { 
      event.preventDefault()
      copyOperatorIntoGraphOperator(ownId, selectedOperator) 
    }
    return (
      <form className='selector' onSubmit={submitOperatorChoice} >
        <select onChange={changeOperatorChoice}>
          {operators.map(operator => <option key={operator._id} value={operator._id}>{operator.operator_type}</option>)}
        </select>
        <input type="submit" value="Submit" />
      </form>
    )
  }
)

class GraphEditorClass extends Component {

  componentDidMount() {

    jsPlumbInstance = jsPlumb.getInstance();
    jsPlumbInstance.setContainer($('#container'));

    // creating an operator in the graph
    jsPlumbInstance.bind('connection', (info,originalEvent) => {
      if (originalEvent) { // testing if the event comes from a human
        addGraphOperator({ graphId: this.props.graphId , from: info.sourceId, to: info.targetId })
      }
    });

    // creating an activity in the graph
    planeNames.forEach(plane => {
      $('#'+plane).dblclick(event => {
        event.preventDefault()
        if(this.props.graphId && Graphs.findOne({ _id: this.props.graphId })) {
          const newGraphActivityId = addGraphActivity({ 
            plane: plane, 
            xPosition: event.offsetX, 
            graphId: this.props.graphId
          })
        } else {
          alert('you need to select a graph to edit or create a new one')
        }
      })
    })

    jsPlumbDrawAll(this.props.activities,this.props.operators)
  }

  componentDidUpdate() {
    jsPlumbRemoveAllAndDrawAgain(this.props.activities,this.props.operators)
  }

  render() { return(
    <div>
      <h3>Graph editor</h3>
      <div>
        <p>Double click for creating</p>
        <div id='container'>
          {planeNames.map((plane) => { return(
            <div className='plane' id={plane} key={plane}>
              <p style={{float:'right'}}>{plane}</p>
              { this.props.activities.map(activity =>
                plane==activity.plane ?
                  <ActivityInEditor
                    key={activity._id}
                    activity={activity} 
                  />
                :null
              )}
            </div>
          )})}
        </div>
        <input
          onChange={(event) => renameGraph(this.props.graphId, event.target.value)}
          value={this.props.graph? this.props.graph.name: 'untitled'}
        />
      </div>
      { this.props.operators.map(operator => {
        return(
          !operator.data && <OperatorChoiceComponent key={operator._id} ownId={operator._id} />
        )
      })}
    </div>
  )}
}

const GraphEditor = createContainer(
  (props) => { return({
    ...props,
    graph: Graphs.findOne({ _id: props.graphId }),
    activities: Activities.find({ graphId: props.graphId }).fetch(),
    operators: Operators.find({ graphId: props.graphId }).fetch(),
  })}, 
  GraphEditorClass
)

const GraphList = createContainer(
  (props) => {
    return({
      currentGraphId: props.graphId? props.graphId :null,
      graphs: Graphs.find().fetch()
    })
  },
  ( { graphs, editSavedGraph, currentGraphId } ) => {

    const editGraph = (graphId) => {
      jsPlumbRemoveAll() 
      setCurrentGraph(graphId)
    }

    const submitRemoveGraph = (graphId) => {
      jsPlumbRemoveAll()
      removeGraph(graphId)
    }

    return(
      <div>
        <h3>Graph list</h3>
        <button className='btn btn-primary btn-sm' onClick={() => editGraph(addGraph())}>New</button>
        <ul> { graphs.map((graph) => 
          <li style={{listStyle: 'none'}} key={graph._id}>
            <a href='#' onClick={ () => submitRemoveGraph(graph._id) }><i className="fa fa-times" /></a>
            <a href='#' onClick={ () => editGraph(graph._id) } ><i className="fa fa-pencil" /></a>
            {graph.name} {graph._id==currentGraphId? '(current)':null}
          </li>
        )} </ul>
      </div>
    )
  }
)

export default createContainer(
  () => {
    const user = Meteor.users.findOne({_id:Meteor.userId()})
    const graphId = user.profile? user.profile.editingGraph :null
    return({ 
      user: user,
      graphId: graphId 
    })
  },
  ({ graphId, user }) => { return(
    <div>
      <GraphEditor graphId={graphId} />
      <GraphList graphId={graphId} />
    </div>
  )}
)
