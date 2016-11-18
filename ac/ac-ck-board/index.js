import React from 'react'
import ActivityRunner from './board'
import Chat from './chat'
import Dashboard from './dashboard'

export const meta = {
  name: 'Common Knowledge Board activity',
  type: 'react-component',
  mode: 'collab'
}

export const config = {
  title: 'Configuration for Common Knowledge Board activity',
  type: 'object',
  properties: {
    'name': {
      type: 'string',
      title: 'Activity name'
    }
  }
}

export const ActivityRunnerWrapper = (props) => 
  <div>
    <div className='col-md-4'><ActivityRunner {...props} /> </div>
    <div className='col-md-4'><Chat {...props} /></div>
  </div>


export default { id: 'ac-ck-board', meta: meta, config: config, ActivityRunner: ActivityRunnerWrapper, Dashboard: Dashboard }
