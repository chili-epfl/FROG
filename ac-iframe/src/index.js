import React, { Component } from 'react'
import ReactIframe from 'react-iframe'

export const meta = {
  id: 'ac-iframe',
  name: 'Embedded website',
  type: 'react-component'
}

export const config = {
  title: 'Configuration for Embedded website',
  type: 'object',
  properties: {
    'name': {
      type: 'string',
      title: 'Activity name'
    },
    'url': {
      type: 'string',
      title: 'URL of website'
    }
  }
}

export const activity = ({ config }) => 
        <div>
          <iframe src = {config.url} width={750} height={600} />
        </div>


export default {activity: activity, config: config, meta: meta}
