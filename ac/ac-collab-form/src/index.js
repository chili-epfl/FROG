import React from 'react'
import ActivityRunner from './form'
import { Chat } from 'frog-utils'
import Dashboard from './dashboard'

export const meta = {
  name: 'Simple collab form',
  type: 'react-component',
  mode: 'collab'
}

export const config = {
  title: 'Configuration for Simple Collab Form',
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
    'title': {
      type: 'string',
      title: 'Form title'
    },
    'questions': {
      type: 'string',
      title: 'Type in questions, separated by comma'
    }
  }
}

export const ActivityRunnerWrapper = (props) => 
  <div>
    <div className='col-md-4'><ActivityRunner {...props} /> </div>
    <div className='col-md-4'><Chat {...props} /></div>
  </div>


export default { id: 'ac-collab-form', meta: meta, config: config, ActivityRunner: ActivityRunnerWrapper, Dashboard: Dashboard }
