import React, {Component, PropTypes} from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import ReactDOM from 'react-dom'
import { uuid } from 'frog-utils'
import { $ } from 'meteor/jquery'

import { Graphs, addGraph, setCurrentGraph, removeGraph, renameGraph } from '../../api/graphs'
import { Activities, Operators } from '../../api/activities'
import Graph, { RenderGraph, computeTopPosition } from './Graph'
import ContentEditable from 'react-contenteditable';

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
    let {graphId} = this.props
    let plane1 = computeTopPosition("#repo" + graphId + "line1", "repo" + graphId)
    let plane2 = computeTopPosition("#repo" + graphId + "line2", "repo" + graphId)
    let plane3 = computeTopPosition("#repo" + graphId + "line3", "repo" + graphId)
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
        plane={this.state.planes}
        graphId={"repo" + this.props.graphId}/>
    )
  }
}

removeHTML = (text) => {
  return text.split(/<|&/)[0]
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

  handleRemove = (graphId) => {
    removeGraph(graphId)
    if(this.state.current == graphId) {
      setCurrentGraph(null)
      this.setState({current: null, loaded: false})
    }
  }

  handleRename = (event, id, previousName) => {
    const newName = removeHTML(event.target.value).trim()
    if(previousName != newName) {
      console.log("new")
      renameGraph(id, newName)
    }
  }

  render() {
    return (
      <div>
        <h3>Graph list</h3>
        <ul> { this.props.graphs.map((graph) =>
          <li style={{listStyle: 'none', display: "inline"}} key={graph._id}>
            <a href='#' onClick={ () => this.handleRemove(graph._id) }><i className="fa fa-times" /></a>
            <a href='#' onClick={ () => this.submitReplace(graph._id) } ><i className="fa fa-pencil" /></a>
            <a href='#' onClick={ () => this.handleInfoClick(graph._id)} ><i className="fa fa-info" /></a>

            <ContentEditable html={graph.name} disabled={false} onChange={(event) => this.handleRename(event, graph._id, graph.name)} />
            {this.state.current == graph._id ? '(current)':null}
            {this.state.infoToDisplay == graph._id ?
              <RenderRepoGraph graphId= {graph._id} /> : "" }
          </li>
        )} </ul>

        <h3>Graph editor</h3>
        <button className='btn btn-primary btn-sm' onClick={() => this.submitReplace(addGraph())}>New</button>
        {
          this.state.current ?
            <div>
              <br/>
              <Graph activities = {this.props.activities} operators = {this.props.operators} graphId={this.state.current} loaded={this.state.loaded} handleLoaded={this.handleLoaded}/>
            </div>
            : ""
        }
      </div>
    )
  }
}

export default createContainer(() => {
  const user = Meteor.users.findOne({_id:Meteor.userId()})
  let currentGraphId = ""
  if(user.profile && user.profile.editingGraph) {
    currentGraphId = user.profile.editingGraph
  }
  return {
    graphs: Graphs.find().fetch(),
    activities: Activities.find({ graphId: null}).fetch(),
    operators: Operators.find({ graphId: null }).fetch(),
    graphId: currentGraphId
  }
}, GraphEditor)
