export default {
  title: 'Configuration for Form',
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
    },
    'multiple': {
      type: 'string',
      title: 'Allow multiple submissions?',
      enum: [
        'false',
        'true'
      ]
    }
  }
}

