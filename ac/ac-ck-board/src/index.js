import React from 'react'
import Board from './board'

export const meta = {
  name: 'Common Knowledge board',
  type: 'react-component',
  mode: 'collab'
}

export const config = {
  title: 'Configuration for Common Knowledge board',
  type: 'object',
  properties: {
    'name': {
      type: 'string',
      title: 'Activity name'
    },
    'duration': {
      type: 'number',
      title: 'Duration in seconds (0 for infinity)'
    },
  }
}

export const BoardWrapper = (props) => 
  <div>
    <div className='col-md-4'><Board {...props} /> </div>
  </div>


export default { id: 'ac-ck-board', meta: meta, config: config, ActivityRunner: BoardWrapper, Dashboard: null }

