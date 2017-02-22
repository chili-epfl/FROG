// @flow

import React from 'react'

import type { ActivityRunnerT, ActivityPackageT } from 'frog-utils'

export const meta = {
  name: 'HTML text component',
  type: 'react-component'
}

export const config = {
  title: 'Configuration for text component',
  type: 'object',
  properties: {
    'title': {
      type: 'string',
      title: 'Title'
    },
    'text': {
      type: 'string',
      title: 'Text (HTML)'
    },
    showProducts: {
      type: 'boolean',
      title: 'Show products?'
    }
  }
}

export const ActivityRunner = ( { config, object }: ActivityRunnerT ) =>  
  <div>
    <h1>{config.title}</h1>
    <p>{config.text}</p>
    { config.showProducts
      ? <pre>{JSON.stringify(object.products, null, 2)}</pre>
      : null}
  </div>
export default ({ id: 'ac-text', ActivityRunner: ActivityRunner, config: config, meta: meta }: ActivityPackageT)
