import React, { Component } from 'react'
import ReactIframe from 'react-iframe'

export const meta = {
  id: 'ac-text',
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

export const activity = ( { config }) => 
  <div><h1>{config.title}</h1>{config.text}</div>

export default {activity: activity, config: config, meta: meta}
