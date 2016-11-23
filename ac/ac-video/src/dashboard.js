import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { ProgressBar } from 'react-bootstrap'
import {color_range as color} from 'frog-utils'

const VideoProgress = ({ data }) => {
  let backgroundColor
  let bsStyle
  if(data.paused) { 
    bsStyle='warning'
    backgroundColor=color(data.updated_at)
  } else {
    backgroundColor=null
  }
  
  if(data.ended) { 
    bsStyle: 'danger' 
  }
  return (
    <div className='container-fluid'>
      <h4 
        style={{
          float: 'left', 
          marginRight: '1em'
        }} > 
        {data.username}
      </h4> 
    <ProgressBar 
      now={data.played * 100} 
      label={Math.round(data.played * 1000)/10}
      bsStyle={bsStyle} 
      style={{align: 'right', backgroundColor: backgroundColor}}/>
  </div>
  )
}

class Dash extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    const interval = setInterval(() =>
      this.forceUpdate(), 2000)
    this.setState({interval: interval})
  }

  componentWillUnmount() {
    window.clearInterval(this.state.interval)
  }

  render() {
    return(
      <div>
        {this.props.logs.map(x => <VideoProgress data={x} key={x._id}/>)}
      </div>
    )
  }
}

export default Dash
