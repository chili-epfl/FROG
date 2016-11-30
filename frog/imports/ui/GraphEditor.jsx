import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';
import Draggable from 'react-draggable';
import Form from 'react-jsonschema-form'

import { Activities, Operators, addGraphActivity, addGraphOperator, copyActivityIntoGraphActivity, copyOperatorIntoGraphOperator, dragGraphActivity, deleteGraphActivities } from '../api/activities';
import { Graphs, addGraph, renameGraph } from '../api/graphs';
import { uuid } from 'frog-utils'

import jsPlump from 'jsplumb';
import { $ } from 'meteor/jquery';

const planeNames = ['class','group','individual'];

const setCurrentGraph = (graphId) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.editingGraph': graphId}})
}

var jsPlumbInstance = null

jsPlumbRemoveAll = () => {
  console.log('jsPlumbRemoveAll')
  jsPlumbInstance.detachEveryConnection();
  jsPlumbInstance.deleteEveryEndpoint();
  jsPlumbInstance.unmakeEveryTarget();
  jsPlumbInstance.unmakeEverySource();
}

jsPlumbDrawAll = (activities,operators) => {
  console.log('jsPlumbDrawAll')
  activities.forEach(activity => {
    jsPlumbInstance.makeSource($('#'+activity._id),{anchor:'Continuous'})
    jsPlumbInstance.makeTarget($('#'+activity._id),{anchor:'Continuous'})
  })
  operators.forEach(operator => {
    jsPlumbInstance.connect({
      source:$('#'+operator.source),
      target:$('#'+operator.target),
      anchors:['Continuous','Continuous']
    })
  })
}

jsPlumbRemoveAllAndDrawAgain = (activities,operators) => {
  console.log('jsPlumbRemoveAllAndDrawAgain')
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

    const submitActivityChoice = (e) => { 
      e.preventDefault()
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

const ActivityInEditor = ( { activity }  ) => { 

  const eventLogger = (e, data) => {
    console.log('Event: ', event);
    console.log('Data: ', data);
    dragGraphActivity(activity._id, activity.xPosition)
  }

  return (
    <Draggable
      axis='x'
      bounds='parent'
      handle='.title'
      onStop={eventLogger} >
      <div className={'item'} style={{left: activity.xPosition}}>
        { activity.data ? 
          <div className={'title'}> {activity.data.name} </div>
          : <ActivityChoiceComponent ownId={activity._id} />
        }
        <button
          id={activity._id}
          className='btn btn-primary btn-sm connector'
          style={{bottom: 0,width:'100%'}}>
          Connect
        </button>
      </div>
    </Draggable>
  )
}

const OperatorChoiceComponent = createContainer(() => {
  return {
    operators: Operators.find({status:'OUT'}).fetch()
  }
}, ({ outOperators, ownId }) => {
  var selectedOperator = operators[0] ? operators[0]._id: null
  
  const changeOperatorChoice = (event) => {selectedOperator = event.target.value}
  
  const submitOperatorChoice = () => { copyOperatorIntoGraphOperator(ownId, selectedOperator) }

  return (
    <form className='selector' onSubmit={submitOperatorChoice} >
      <select onChange={changeOperatorChoice}>
        {operators.map(operator => <option key={operator._id} value={operator._id}>{operator.operator_type}</option>)}
      </select>
      <input type="submit" value="Submit" />
    </form>
  )
})

class GraphEditorClass extends Component {
  
  deleteAll = () => {
    jsPlumbRemoveAll()
    deleteGraphActivities(this.props.graph._id)
    setState({name: 'untitled',activities: [],operators: []})
  }
  renameCurrentGraph = (name) => { console.log('rename') }
  copyCurrentGraph = () => { console.log('copy') }
  saveCurrentGraph = () => { addOrUpdateGraph(graph) }

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
      { this.props.operators.map(operator => 
          operator.data ? 
            null 
          : <OperatorChoiceComponent
              key={operator._id}
              ownId={operator._id} 
            /> 
      )}
    </div>
  )}
}

const GraphEditor = createContainer(
  (props) => { 
    return( {
      ...props,
      graph: props.graphId? Graphs.findOne({ _id: props.graphId }) :null,
      activities: props.graphId? Activities.find({ graphId: props.graphId }).fetch() :null,
      operators: props.graphId? Operators.find({ graphId: props.graphId }).fetch() :null
    })
  }, 
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
      console.log('edit')
      setCurrentGraph(graphId)
    }
    
    const newGraph = () => { 
      const id = addGraph()
      editGraph(id)
    }

    return(
      <div>
        <h3>Graph list</h3>
        <button className='btn btn-primary btn-sm' onClick={newGraph}>New</button>
        <ul> { graphs.map((graph) => 
          <li style={{listStyle: 'none'}} key={graph._id}>
            <a href='#' onClick={ () => Graphs.remove({_id: graph._id}) }><i className="fa fa-times" /></a>
            <a href='#' onClick={ () => editGraph(graph._id) } ><i className="fa fa-pencil" /></a>
            {graph.name} {graph._id==currentGraphId? '(current)':null}
          </li>
        )} </ul>
      </div>
    )
  }
)

class Main extends Component { 
  
  addActivity = (activityId) => {
    console.log('addActivity')
    this.forceUpdate()
  }

  addOperator= (source, target) => {
    const id = addGraphOperator({ graphId: this.state._id, from:source, to:target })
    this.state.operators.push(id)
    this.forceUpdate()
  }

  componentDidMount() {
    const that = this

    jsPlumbInstance = jsPlumb.getInstance();
    jsPlumbInstance.setContainer($('#container'));

    jsPlumbInstance.bind('connection', function(info,originalEvent) {
      if (originalEvent) { // testing if the event comes from a human
        that.addOperator(info.sourceId,info.targetId)
      }
    });

    planeNames.forEach(plane => {
      $('#'+plane).dblclick(e => {
        console.log(e)
        if(this.props.graphId && Graphs.findOne({ _id: this.props.graphId })) {
          const newGraphActivityId = addGraphActivity({ 
            plane:plane, 
            xPosition:e.offsetX, 
            graphId: this.props.graphId
          })
          that.addActivity(newGraphActivityId)
        } else {
          alert('you need to select a graph to edit or create a new one')
        }
      })
    })
  }

  render() { return(
    <div>
      <GraphEditor graphId={this.props.graphId} />
      <GraphList graphId={this.props.graphId} />
    </div>
  )}
}

export default createContainer(
  () => {
    const user = Meteor.users.findOne({_id:Meteor.userId()})
    const graphId = user.profile? user.profile.editingGraph :null
    return({ 
      user: user,
      graphId: graphId 
    })
  },
  Main
)
