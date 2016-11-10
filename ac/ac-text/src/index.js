import React from 'react'

export const meta = {
  name: 'HTML text component',
  type: 'react-component'
}

export const config = {
  title: 'Configuration for text component',
  type: 'object',
  properties: {
    'name': {
      type: 'string',
      title: 'Activity name'
    },
    'title': {
      type: 'string',
      title: 'Title'
    },
    'text': {
      type: 'string',
      title: 'Text (HTML)'
    }
  }
}

export const ActivityRunner = ( { config, data }) => 
  <div><h1>{config.title}</h1>{config.text}<hr/><div dangerouslySetInnerHTML={{__html: data}} /></div>

export default { id: 'ac-text', ActivityRunner: ActivityRunner, config: config, meta: meta }
