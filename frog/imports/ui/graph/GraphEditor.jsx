import React, {Component, PropTypes} from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import ReactDOM from 'react-dom'
import { uuid } from 'frog-utils'

import { Graphs, addGraph, remameGraph } from '../../api/graphs'
import { Activities, Operators, removeGraph } from '../../api/activities'
import Graph, { RenderGraph, computeTopPosition } from './Graph'

const setCurrentGraph = (graphId) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.editingGraph': graphId}})
}

class RenderRepoGraph extends Component {
  constructor(props) {
    super(props)

    let activities = Activities.find({graphId: props.graphId})
    let operators = Operators.find({graphId: props.graphId})
    let positions = activities.map((activity) => { return {plane: activity.plane, position: activity.position}})
    this.state = {
      activities: activities,
      operators: operators,
      positions: positions,
      loaded: false,
      planes: {plane1:0, plane2: 0, plane3:0}
    }
  }

  componentDidMount() {
    let plane1 = computeTopPosition("#line1")
    let plane2 = computeTopPosition("#line2")
    let plane3 = computeTopPosition("#line3")
    this.setState({loaded: true, planes: {plane1: plane1, plane2:plane2, plane3:plane3}})
  }

  render() {
    return (
      <RenderGraph
        activities={this.state.activities}
        operators={this.state.operators}
        editorMode={false}
        loaded={this.state.loaded}
        positions={this.state.positions}
        plane={this.state.planes}/>
    )
  }
}

class GraphEditor extends Component {

  constructor(props) {
    super(props)

    this.state = {
      infoToDisplay: "",
      loaded: false,
      current: props.graphId
    }
  }

  handleInfoClick = (graphId) => {
    let info = this.state.infoToDisplay
    this.setState({infoToDisplay: graphId==info ? "" : graphId})
  }

  handleLoaded = () => {
    this.setState({loaded: true})
  }

  submitReplace = (graphId) => {
    setCurrentGraph(graphId)
    this.setState({current: graphId, loaded: false})
  }

  render() {
    return (
      <div>
        <h3>Graph list</h3>
        <ul> { this.props.graphs.map((graph) =>
          <li style={{listStyle: 'none'}} key={graph._id}>
            <a href='#' onClick={ () => removeGraph(graph._id) }><i className="fa fa-times" /></a>
            <a href='#' onClick={ () => this.submitReplace(graph._id) } ><i className="fa fa-pencil" /></a>
            <a href='#' onClick={ () => this.handleInfoClick(graph._id)} ><i className="fa fa-info" /></a>
            {graph._id} {this.state.current == graph._id ? '(current)':null}
            {this.state.infoToDisplay == graph._id ?
              <RenderRepoGraph graphId= {graph._id} /> : "" }
          </li>
        )} </ul>

        <h3>Graph editor</h3>
        <button className='btn btn-primary btn-sm' onClick={() => this.submitReplace(addGraph())}>New</button>
        <Graph activities = {this.props.activities} operators = {this.props.operators} loaded={this.state.loaded} handleLoaded={this.handleLoaded}/>
      </div>
    )
  }
}

export default createContainer(() => {
  const user = Meteor.users.findOne({_id:Meteor.userId()})
  let currentGraphId = ""
  if(user.profile) {
    currentGraphId = user.profile.editingGraph
  }
  return {
    graphs: Graphs.find().fetch(),
    activities: Activities.find({ graphId: null}).fetch(),
    operators: Operators.find({ graphId: null }).fetch(),
    graphId: currentGraphId
  }
}, GraphEditor)
