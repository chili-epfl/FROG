import React, { Component } from 'react'
import { groupBy, map } from 'lodash'
import color from './color_range'

const GroupView = ({ members, group }) => {
  return (
    <div>
      <h2>Group {group}</h2>
      {members.map(x => {
        const textcolor = color(x.updated_at)
        return(
          <li> <span style={{color: textcolor}}>{x.username}</span></li>
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
      <h2>Student activity</h2>
      {map(groups, (v, k) => <GroupView members={v} group={k} key={k} />)}
    </div>)
  }
}

export default CollabForm
