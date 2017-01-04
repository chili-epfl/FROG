import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'

import Draggable from 'react-draggable'
import jsPlumb from 'jsplumb'
import { $ } from 'meteor/jquery'

import { Activities, Operators, removeGraphActivity, addGraphActivity, addGraphOperator, copyActivityIntoGraphActivity, copyOperatorIntoGraphOperator, dragGraphActivity, removeGraph } from '../api/activities'
import { Graphs, addGraph, renameGraph } from '../api/graphs'

const planeNames = ['class', 'group', 'individual']

const setCurrentGraph = (graphId) => {
  Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.editingGraph': graphId } })
}

let jsPlumbInstance = null

const getPosition = (id) => {
  const connectorP = $('#' + id).position()
  const itemP = $('#item' + id).position()
  return ((connectorP && itemP) ? {
    left: itemP.left,
    top: itemP.top + connectorP.top
  } : { left: 0, top: 0 })
}

const jsPlumbRepaintWithId = (activityId) => {
  try {
    const connector = $('#' + activityId)
    jsPlumbInstance.repaint(connector, getPosition(activityId))
  } catch (err) {
    // Nothing to repaint
  }
}

const jsPlumbRemoveAll = () => {
  if (jsPlumbInstance) {
    jsPlumbInstance.detachEveryConnection();
    jsPlumbInstance.deleteEveryEndpoint();
    jsPlumbInstance.unmakeEveryTarget();
    jsPlumbInstance.unmakeEverySource();
  }
}

const jsPlumbDrawAll = (activities, operators) => {
  if (jsPlumbInstance) {
    activities.forEach((activity) => {
      const connector = $('#' + activity._id)
      jsPlumbInstance.makeSource(connector, { anchor: 'Continuous' })
      jsPlumbInstance.makeTarget(connector, { anchor: 'Continuous' })
    })
    operators.forEach((operator) => {
      jsPlumbInstance.connect({
        source: $('#' + operator.from),
        target: $('#' + operator.to),
        anchors: ['Continuous', 'Continuous']
      })
      jsPlumbRepaintWithId(operator.from)
      jsPlumbRepaintWithId(operator.to)
    })
  }
}

const jsPlumbRemoveAllAndDrawAgain = (activities, operators) => {
  jsPlumbRemoveAll()
  jsPlumbDrawAll(activities, operators)
}

const ChoiceComponent = ({ choices, ownId, submitChoiceFn, displayFn }) => {
  let selectedChoice = choices[0] ? choices[0]._id : null
  const changeChoice = (event) => { selectedChoice = event.target.value }
  const submitChoice = (event) => {
    event.preventDefault()
    submitChoiceFn(ownId, selectedChoice)
  }

  return (
    <form className='selector' onSubmit={submitChoice} >
      <select onChange={changeChoice}>
        {choices.map((choice) =>
          <option key={choice._id} value={choice._id}>
            {displayFn(choice)}
          </option>
        )}
      </select>
      <input type='submit' value='Submit' />
    </form>
  )
}

const ActivityChoiceComponent = createContainer(
  (props) => ({
    ...props,
    choices: Activities.find({ graphId: null, sessionId: null }).fetch(),
    submitChoiceFn: copyActivityIntoGraphActivity,
    displayFn: ((activity) => activity.data.name)
  }),
  ChoiceComponent
)

const OperatorChoiceComponent = createContainer(
  (props) => ({
    ...props,
    choices: Operators.find({ graphId: null, sessionId: null }).fetch(),
    submitChoiceFn: copyOperatorIntoGraphOperator,
    displayFn: ((operator) => operator.operatorType)
  }),
  ChoiceComponent
)

class ActivityInEditor extends Component {
  onStop = (event, data) => {
    dragGraphActivity(this.props.activity._id, data.x)
    this.forceUpdate()
  }

  onDrag = () => {
    jsPlumbRepaintWithId(this.props.activity._id)
  }

  submitRemoveActivity = () => {
    jsPlumbRemoveAll()
    removeGraphActivity(this.props.activity._id)
  }

  render() {
    return (
      <Draggable
        axis='x'
        handle='.title'
        position={{ x: 0, y: 0 }}
        onDrag={this.onDrag}
        onStop={this.onStop}
      >
        <div
          className='item'
          style={{ left: this.props.activity.xPosition, top: this.props.activity.yPosition }}
          id={'item' + this.props.activity._id}
        >
          { this.props.activity.data ?
            <div className={'title'} > {this.props.activity.data.name} </div>
            : <ActivityChoiceComponent ownId={this.props.activity._id} />
          }
          <a
            href='#'
            onClick={this.submitRemoveActivity}
            style={{ position: 'absolute', top: 0, right: 0 }}
          > <i className='fa fa-times' /> </a>
          <button
            className='btn btn-primary btn-sm connector'
            style={{ bottom: 0, width: '100%', position: 'absolute' }}
            id={this.props.activity._id}
          > Connect </button>
        </div>
      </Draggable>
    )
  }
}

class GraphEditorClass extends Component {

  componentDidMount() {
    jsPlumbInstance = jsPlumb.getInstance();
    jsPlumbInstance.setContainer($('#container'));

    // creating an operator in the graph
    jsPlumbInstance.bind('connection', (info, originalEvent) => {
      if (originalEvent) { // testing if the event comes from a human
        addGraphOperator({ graphId: this.props.graphId, from: info.sourceId, to: info.targetId })
      }
    });

    // creating an activity in the graph
    planeNames.forEach((plane) => {
      $('#' + plane).dblclick((event) => {
        event.preventDefault()
        if (this.props.graph) {
          addGraphActivity({
            plane,
            xPosition: event.offsetX,
            yPosition: { class: 0, group: 100, individual: 200 }[plane],
            graphId: this.props.graphId
          })
        } else {
          alert('you need to select a graph to edit or create a new one') // eslint-disable-line
        }
      })
    })

    jsPlumbDrawAll(this.props.activities, this.props.operators)
  }

  componentDidUpdate() {
    jsPlumbRemoveAllAndDrawAgain(this.props.activities, this.props.operators)
  }

  render() {
    return (
      <div>
        <h3>Graph editor</h3>
        <div>
          <p>Double click for creating</p>
          <div id='container'>
            { planeNames.map((plane) =>
              <div className='plane' id={plane} key={plane}>
                <div className='lineInPlane' />
                <p style={{ position: 'absolute', top: '33%' }}>{plane}</p>
              </div>
            )}
            { this.props.activities.map((activity) =>
              <ActivityInEditor key={activity._id} activity={activity} />
            )}
          </div>
          <input
            onChange={(event) => renameGraph(this.props.graphId, event.target.value)}
            value={this.props.graph ? this.props.graph.name : 'untitled'}
          />
        </div>
        {this.props.operators.map((operator) => (
          !operator.data && <OperatorChoiceComponent key={operator._id} ownId={operator._id} />
        ))}
      </div>
    )
  }
}

const GraphEditor = createContainer(
  (props) => ({
    ...props,
    graph: Graphs.findOne({ _id: props.graphId }),
    activities: props.graphId ? Activities.find({ graphId: props.graphId }).fetch() : [],
    operators: props.graphId ? Operators.find({ graphId: props.graphId }).fetch() : []
  }),
  GraphEditorClass
)

const GraphList = createContainer(
  (props) => (
    { ...props, graphs: Graphs.find().fetch() }
  ),
  ({ graphs, graphId }) => {
    const editGraph = (id) => {
      jsPlumbRemoveAll()
      setCurrentGraph(id)
    }

    const submitRemoveGraph = (id) => {
      jsPlumbRemoveAll()
      removeGraph(id)
    }

    return (
      <div>
        <h3>Graph list</h3>
        <button className='btn btn-primary btn-sm' onClick={() => editGraph(addGraph())}>New</button>
        <ul> {graphs.map((graph) =>
          <li style={{ listStyle: 'none' }} key={graph._id}>
            <a href='#' onClick={() => submitRemoveGraph(graph._id)}><i className='fa fa-times' /></a>
            <a href='#' onClick={() => editGraph(graph._id)}><i className='fa fa-pencil' /></a>
            {graph.name} {graph._id === graphId ? '(current)' : null}
          </li>
        )} </ul>
      </div>
    )
  }
)

export default createContainer(
  () => {
    const user = Meteor.users.findOne({ _id: Meteor.userId() })
    const graphId = user.profile ? user.profile.editingGraph : null
    return ({ graphId })
  },
  ({ graphId }) =>
    <div>
      <GraphEditor graphId={graphId} />
      <GraphList graphId={graphId} />
    </div>
)
