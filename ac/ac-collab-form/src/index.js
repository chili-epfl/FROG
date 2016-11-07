import React from 'react'
import ActivityRunner from './form'

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
    'title': {
      type: 'string',
      title: 'Form title'
    },
    'questions': {
      type: 'string',
      title: 'Type in true/false questions, separated by comma'
    }
  }
}

export const ActivityRunnerWrapper = (props) => { 
  console.log(props)
  return( <ActivityRunner {...props} /> )
}


export default { id: 'ac-collab-form', meta: meta, config: config, ActivityRunner: ActivityRunnerWrapper }
