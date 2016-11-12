import React from 'react';
import Form from "react-jsonschema-form";

export const meta = {
  name: 'Simple form',
  type: 'react-component'
}

export const config = {
  title: 'Configuration for Form (provisional)',
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

// Obviously assumes even array
export const ActivityRunner = ({ config, logger, result }) => {
  const propdef = config.questions.split(',').reduce(
    (acc, x, i) => ({...acc, [i + '']: { type: 'string', title: x}}),
    {} )
  const formdef = { 
    title: config.title,
    type: 'object',
    properties: propdef
  } 
  return (
    <Form schema={formdef} onSubmit={result} onChange={(x) => logger('form changed: ' + JSON.stringify(x))} />
  )
}

export default { id: 'ac-form', meta: meta, config: config, ActivityRunner: ActivityRunner }
