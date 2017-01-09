import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { Graphs, addGraph, setCurrentGraph, renameGraph } from '../../api/graphs'
import { Activities, Operators, duplicateGraph, removeGraph } from '../../api/activities'
import Graph from './Graph'

class GraphEditor extends Component {

  constructor(props) {
    super(props)

    this.state = {
      infoToDisplay: '',
      loaded: false,
      repoLoaded: false,
      current: props.graphId
    }
  }

  handleInfoClick = (graphId) => {
    const info = this.state.infoToDisplay
    this.setState({ infoToDisplay: graphId === info ? '' : graphId })
  }

  handleLoaded = () => {
    this.setState({ loaded: true })
  }

  handleRepoLoaded = () => {
    this.setState({ repoLoaded: true })
  }

  submitReplace = (graphId) => {
    setCurrentGraph(graphId)
    this.setState({ current: graphId, loaded: false })
  }

  handleRemove = (graphId) => {
    removeGraph(graphId)
    if (this.state.current === graphId) {
      setCurrentGraph(null)
      this.setState({ current: null, loaded: false })
    }
  }

  handleRename = (event, id, oldName) => {
    const newName = event.target.value.trimLeft()
    if (oldName !== newName) {
      renameGraph(id, newName)
    }
  }

  handleDuplicate = (graphId) => {
    const newGraphId = duplicateGraph(graphId)
    this.submitReplace(newGraphId)
  }

  render() {
    return (
      <div>
        <h3>Graph list</h3>
        <ul> { this.props.graphs.map((graph) =>
          <li style={{ listStyle: 'none', margin: '10px 0' }} key={graph._id}>
            <a href='#' onClick={() => this.handleRemove(graph._id)}><i className='fa fa-times' /></a>
            <a href='#' onClick={() => this.submitReplace(graph._id)}><i className='fa fa-pencil' /></a>
            <a href='#' onClick={() => this.handleInfoClick(graph._id)} ><i className='fa fa-info' /></a>
            <a href='#' onClick={() => this.handleDuplicate(graph._id)} ><i className='fa fa-copy' /></a>
            <input type='text' value={graph.name} onChange={(event) => this.handleRename(event, graph._id, graph.name)} />
            {this.state.current === graph._id ? '(current)' : null}
            {this.state.infoToDisplay === graph._id ?
              <Graph
                activities={[]}
                operators={[]}
                graphId={graph._id}
                loaded={this.state.current === graph._id ? this.state.loaded
                                                          : this.state.repoLoaded}
                handleLoaded={this.state.current === graph._id ? this.handleLoaded
                                                                : this.handleRepoLoaded}
                editorMode={false}
              />
              : '' }
          </li>
        )} </ul>

        <h3>Graph editor</h3>
        <button className='btn btn-primary btn-sm' onClick={() => this.submitReplace(addGraph())}>New</button>
        {
          this.state.current ?
            <div>
              <br/>
              <Graph
                activities={this.props.activities}
                operators={this.props.operators}
                graphId={this.state.current}
                loaded={this.state.loaded}
                handleLoaded={this.handleLoaded}
                editorMode
              />
            </div>
            : ''
        }
      </div>
    )
  }
}

export default createContainer(() => {
  const user = Meteor.users.findOne({ _id: Meteor.userId() })
  let currentGraphId = ''
  if (user.profile && user.profile.editingGraph) {
    currentGraphId = user.profile.editingGraph
  }
  return {
    graphs: Graphs.find().fetch(),
    activities: Activities.find({ graphId: null, sessionId: null }).fetch(),
    operators: Operators.find({ graphId: null, sessionId: null }).fetch(),
    graphId: currentGraphId
  }
}, GraphEditor)
