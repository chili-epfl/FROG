import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { booleanize } from 'frog-utils'

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


export const activity = ( { config, logger }) => 
  <ReactPlayer 
    url={config.url}
    playing={booleanize(config.playing)}
    loop={booleanize(config.loop)}
    onStart={() => logger('starting play')}
    onPause={() => logger('pausing video')}
    onEnded={() => logger('video ended')}
    onProgress={(x) => logger('progress' + JSON.stringify(x))}
  />

