import React, { Component } from 'react'
import { groupBy, map, some } from 'lodash'
import {color_range as color} from 'frog-utils'

const GroupView = ({ members, group }) => {
  const completed = some(members, x => x.completed) 
  return (
    <div>
      <h2>Group {group} {completed ? '(completed)' : ''}</h2>
      {members.map(x => {
        const textcolor = completed ? 'blue' : color(x.updated_at)
        return(
          <li key={x.username}> <span style={{color: textcolor}}>{x.username}</span></li>
        )
      }) }
    </div>
  )
}

class CollabForm extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    const interval = setInterval(() =>
      this.forceUpdate(), 3000)
    this.setState({interval: interval})
  }

  componentWillUnmount() {
    window.clearInterval(this.state.interval)
  }

  render() {
    const groups = groupBy(this.props.logs, x => x.group)
    return(<div>
      {map(groups, (v, k) => <GroupView members={v} group={k} key={k} />)}
    </div>)
  }
}

export default CollabForm
