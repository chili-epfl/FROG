import React from 'react'
import ReactPlayer from 'react-player'
import { ProgressBar } from 'react-bootstrap'

const VideoProgress = ({ data }) => {
  let bsStyle
  if(data.paused) { bsStyle='warning' }
  if(data.ended) { bsStyle='danger' }
  return (
    <div className='container'>
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
      style={{align: 'right'}}/>
  </div>
  )
}

export default ({ logs }) => 
  <div>
    {logs.map(x => <VideoProgress data={x} key={x._id}/>)}
  </div>
