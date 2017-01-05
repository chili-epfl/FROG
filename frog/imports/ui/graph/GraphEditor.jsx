import React, {Component, PropTypes} from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import ReactDOM from 'react-dom'
import { uuid } from 'frog-utils'

import { Graphs, addGraph, remameGraph } from '../../api/graphs'
import { Activities, Operators, removeGraph } from '../../api/activities'
import Graph, { RenderGraph } from './Graph'

const setCurrentGraph = (graphId) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.editingGraph': graphId}})
}

const RenderRepoGraph = createContainer(
  (props) => {
    let activities = Activities.find({graphId: props.graphId})
    let operators = Operators.find({graphId: props.graphId})
    let positions = activities.map((activity) => { return {plane: activity.plane, position: activity.position}})
    return ({
      activities: activities,
      operators: operators,
      editorMode: false,
      loaded: true,
      positions:positions
    })

  }, RenderGraph
)

class GraphEditor extends Component {

  constructor(props) {
    super(props)

    this.state = {
      infoToDisplay: "",
    }
  }

  handleInfoClick = (graphId) => {
    let info = this.state.infoToDisplay
    this.setState({infoToDisplay: graphId==info ? "" : graphId})
  }

  render() {
    console.log("->>" + this.state.infoToDisplay)
    return (
      <div>
        <h3>Graph list</h3>
        <ul> { this.props.graphs.map((graph) =>
          <li style={{listStyle: 'none'}} key={graph._id}>
            <a href='#' onClick={ () => removeGraph(graph._id) }><i className="fa fa-times" /></a>
            <a href='#' onClick={ () => setCurrentGraph(graph._id) } ><i className="fa fa-pencil" /></a>
            <a href='#' onClick={ () => this.handleInfoClick(graph._id)} ><i className="fa fa-info" /></a>
            {graph._id} {graph._id? '(current)':null}
            {this.state.infoToDisplay == graph._id ?
              <RenderRepoGraph graphId= {graph._id} /> : "" }
          </li>
        )} </ul>

        <h3>Graph editor</h3>
        <button className='btn btn-primary btn-sm' onClick={() => setCurrentGraph(addGraph())}>New</button>
        <Graph activities = {this.props.activities} operators = {this.props.operators}/>
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    graphs: Graphs.find().fetch(),
    activities: Activities.find({ graphId: null}).fetch(),
    operators: Operators.find({ graphId: null }).fetch()
  }
}, GraphEditor)
