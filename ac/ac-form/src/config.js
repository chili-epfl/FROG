export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Form title'
    },
    questions: {
      type: 'string',
      title: 'Type in questions, separated by comma'
    },
    multiple: {
      type: 'string',
      title: 'Allow multiple submissions?',
      enum: ['false', 'true']
    }
  }
};
