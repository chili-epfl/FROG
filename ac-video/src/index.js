import React, { Component } from 'react'
import ReactPlayer from 'react-player'

export const meta = {
  id: 'ac-video',
  name: 'Video player',
  type: 'react-component'
}

export const config = {
  title: 'Configuration for Video player',
  type: 'object',
  properties: {
    'name': {
      type: 'string',
      title: 'Activity name'
    },
    'url': {
      type: 'string',
      title: 'URL of video'
    },

    'playing': {
      type: 'string',
      title: 'Should video begin auto-playing?',
      enum: [
        'true',
        'false'
      ]
    },
    'loop': {
      type: 'string',
      title: 'Should video loop?',
      enum: [
        'true',
        'false'
      ]
    }
  }
}

const booleanize = (bool) => (bool == 'true') ? true : false

export const activity = ( { config }) => <ReactPlayer 
  url={config.url}
  playing={booleanize(config.playing)}
  loop={booleanize(config.loop)}
/>
